const crypto = require("node:crypto");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

const required = ["MONGO_URI", "VAULT_ENCRYPTION_KEY", "FRONTEND_ORIGIN"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const key = Buffer.from(process.env.VAULT_ENCRYPTION_KEY, "base64");
if (key.length !== 32) {
  console.error("VAULT_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  process.exit(1);
}

const app = express();
function positiveNumber(
  name,
  fallback,
  { integer = false, max = Infinity } = {},
) {
  const raw = process.env[name] || String(fallback);
  const value = Number(raw);
  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    value > max ||
    (integer && !Number.isInteger(value))
  ) {
    throw new Error(
      `${name} must be a positive${integer ? " integer" : " number"}.`,
    );
  }
  return value;
}
const port = positiveNumber("PORT", 3000, { integer: true, max: 65535 });
const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME || "NexLockr";
const allowedOrigins = process.env.FRONTEND_ORIGIN.split(",")
  .map((item) => item.trim())
  .filter(Boolean);
if (
  !allowedOrigins.length ||
  allowedOrigins.some((origin) => {
    try {
      const url = new URL(origin);
      return (
        !["http:", "https:"].includes(url.protocol) || url.origin !== origin
      );
    } catch {
      return true;
    }
  })
) {
  throw new Error(
    "FRONTEND_ORIGIN must contain valid comma-separated origins.",
  );
}
const sessionHours = positiveNumber("SESSION_HOURS", 12, { max: 168 });
const rateBuckets = new Map();
const authRateBuckets = new Map();
let server;
let shuttingDown = false;
app.disable("x-powered-by");
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" },
  }),
);
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "same-site",
  });
  next();
});
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: "16kb" }));

function asyncRoute(handler) {
  return (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
}

function enforceRateLimit(store, limit, windowMs, message) {
  return (req, res, next) => {
    const now = Date.now();
    const keyName = req.ip || "unknown";
    const bucket = store.get(keyName);
    if (!bucket || now - bucket.startedAt > windowMs) {
      store.set(keyName, { count: 1, startedAt: now });
      return next();
    }
    bucket.count += 1;
    if (bucket.count > limit) {
      return res.status(429).json({ error: message });
    }
    return next();
  };
}
const rateLimit = enforceRateLimit(
  rateBuckets,
  120,
  15 * 60 * 1000,
  "Too many requests. Try again later.",
);
const authRateLimit = enforceRateLimit(
  authRateBuckets,
  10,
  15 * 60 * 1000,
  "Too many authentication attempts. Try again later.",
);
app.use(rateLimit);

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}
function cleanText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function normalizeSite(value) {
  const text = cleanText(value, 2048);
  try {
    const url = new URL(
      text.startsWith("http://") || text.startsWith("https://")
        ? text
        : `https://${text}`,
    );
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
function hashPassword(
  password,
  salt = crypto.randomBytes(16).toString("base64"),
) {
  const hash = crypto.scryptSync(password, salt, 64).toString("base64");
  return { salt, hash };
}
function verifyPassword(password, salt, expected) {
  const actual = Buffer.from(hashPassword(password, salt).hash, "base64");
  const target = Buffer.from(expected, "base64");
  return (
    actual.length === target.length && crypto.timingSafeEqual(actual, target)
  );
}
function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return {
    version: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}
function decrypt(payload) {
  if (!payload || payload.version !== 1)
    throw new Error("Unsupported encrypted value");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(payload.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function publicCredential(document) {
  return {
    id: document._id.toString(),
    site: document.site,
    username: document.username,
    password: decrypt(document.passwordEncrypted),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

let db;
const auth = asyncRoute(async (req, res, next) => {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token)
    return res.status(401).json({ error: "Authentication required." });
  const session = await db
    .collection("sessions")
    .findOne({ tokenHash: tokenHash(token), expiresAt: { $gt: new Date() } });
  if (!session)
    return res.status(401).json({ error: "Session expired. Sign in again." });
  req.userId = session.userId;
  req.sessionHash = session.tokenHash;
  return next();
});

app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "nexlockr-api" }),
);

app.post(
  "/api/auth/register",
  authRateLimit,
  asyncRoute(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    if (!validEmail(email) || password.length < 12 || password.length > 128) {
      return res.status(400).json({
        error:
          "Use a valid email and a password between 12 and 128 characters.",
      });
    }
    const users = db.collection("users");
    if (await users.findOne({ email }))
      return res
        .status(409)
        .json({ error: "An account already exists for this email." });
    const passwordData = hashPassword(password);
    const result = await users.insertOne({
      email,
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
      createdAt: new Date(),
    });
    const token = crypto.randomBytes(32).toString("base64url");
    await db.collection("sessions").insertOne({
      userId: result.insertedId,
      tokenHash: tokenHash(token),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + sessionHours * 3600000),
    });
    return res.status(201).json({ token, user: { email } });
  }),
);

app.post(
  "/api/auth/login",
  authRateLimit,
  asyncRoute(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    const user = await db.collection("users").findOne({ email });
    if (
      !user ||
      !verifyPassword(password, user.passwordSalt, user.passwordHash)
    )
      return res.status(401).json({ error: "Invalid email or password." });
    const token = crypto.randomBytes(32).toString("base64url");
    await db.collection("sessions").insertOne({
      userId: user._id,
      tokenHash: tokenHash(token),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + sessionHours * 3600000),
    });
    return res.json({ token, user: { email } });
  }),
);

app.post(
  "/api/auth/logout",
  auth,
  asyncRoute(async (req, res) => {
    await db.collection("sessions").deleteOne({ tokenHash: req.sessionHash });
    return res.status(204).end();
  }),
);

app.get(
  "/api/credentials",
  auth,
  asyncRoute(async (req, res) => {
    const rows = await db
      .collection("credentials")
      .find({ ownerId: req.userId })
      .sort({ updatedAt: -1 })
      .toArray();
    return res.json(rows.map(publicCredential));
  }),
);

function validateCredential(body) {
  const site = normalizeSite(body.site);
  const username = cleanText(body.username, 320);
  const password = typeof body.password === "string" ? body.password : "";
  if (
    !site ||
    username.length < 1 ||
    password.length < 1 ||
    password.length > 2048
  )
    return null;
  return { site, username, password };
}

app.post(
  "/api/credentials",
  auth,
  asyncRoute(async (req, res) => {
    const value = validateCredential(req.body);
    if (!value)
      return res
        .status(400)
        .json({ error: "Provide a valid website, username, and password." });
    const now = new Date();
    const document = {
      ownerId: req.userId,
      site: value.site,
      username: value.username,
      passwordEncrypted: encrypt(value.password),
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection("credentials").insertOne(document);
    return res
      .status(201)
      .json(publicCredential({ ...document, _id: result.insertedId }));
  }),
);

app.put(
  "/api/credentials/:id",
  auth,
  asyncRoute(async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: "Invalid credential identifier." });
    const value = validateCredential(req.body);
    if (!value)
      return res
        .status(400)
        .json({ error: "Provide a valid website, username, and password." });
    const _id = new ObjectId(req.params.id);
    const updatedAt = new Date();
    const result = await db.collection("credentials").findOneAndUpdate(
      { _id, ownerId: req.userId },
      {
        $set: {
          site: value.site,
          username: value.username,
          passwordEncrypted: encrypt(value.password),
          updatedAt,
        },
      },
      { returnDocument: "after" },
    );
    if (!result)
      return res.status(404).json({ error: "Credential not found." });
    return res.json(publicCredential(result));
  }),
);

app.delete(
  "/api/credentials/:id",
  auth,
  asyncRoute(async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: "Invalid credential identifier." });
    const result = await db
      .collection("credentials")
      .deleteOne({ _id: new ObjectId(req.params.id), ownerId: req.userId });
    if (!result.deletedCount)
      return res.status(404).json({ error: "Credential not found." });
    return res.status(204).end();
  }),
);

app.use((req, res) => res.status(404).json({ error: "Route not found." }));
app.use((error, req, res, _next) => {
  console.error(error.message);
  if (error.message === "Origin is not allowed")
    return res.status(403).json({ error: "Origin is not allowed." });
  return res
    .status(500)
    .json({ error: "An unexpected server error occurred." });
});

async function start() {
  await client.connect();
  db = client.db(dbName);
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db
    .collection("sessions")
    .createIndex({ tokenHash: 1 }, { unique: true });
  await db
    .collection("sessions")
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection("credentials").createIndex({ ownerId: 1, updatedAt: -1 });
  server = app.listen(port, () =>
    console.log(`NexLockr API listening on http://localhost:${port}`),
  );
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(
    `${signal} received. Closing HTTP server and MongoDB connection.`,
  );
  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10000);
  forceExit.unref();
  if (server) {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
  await client.close();
  process.exit(0);
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
function setDatabaseForTests(database) {
  db = database;
}
module.exports = {
  app,
  cleanText,
  decrypt,
  encrypt,
  enforceRateLimit,
  hashPassword,
  normalizeSite,
  ObjectId,
  setDatabaseForTests,
  validEmail,
  validateCredential,
  verifyPassword,
};
if (require.main === module) {
  start().catch((error) => {
    console.error("NexLockr API failed to start:", error.message);
    process.exit(1);
  });
}
