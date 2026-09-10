"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
process.env.MONGO_URI = "mongodb://localhost:27017";
process.env.FRONTEND_ORIGIN = "http://localhost:5173";
process.env.VAULT_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
const api = require("./server");

test("password hashing verifies correct values and rejects wrong values", () => {
  const saved = api.hashPassword("CorrectHorseBatteryStaple!");
  assert.equal(
    api.verifyPassword("CorrectHorseBatteryStaple!", saved.salt, saved.hash),
    true,
  );
  assert.equal(
    api.verifyPassword("WrongPassword!", saved.salt, saved.hash),
    false,
  );
});

test("AES-GCM round trip succeeds and tampering is rejected", () => {
  const encrypted = api.encrypt("portfolio-demo-secret");
  assert.equal(encrypted.version, 1);
  assert.equal(api.decrypt(encrypted), "portfolio-demo-secret");
  assert.throws(() =>
    api.decrypt({
      ...encrypted,
      ciphertext: Buffer.from("tampered").toString("base64"),
    }),
  );
  assert.throws(() =>
    api.decrypt({ ...encrypted, tag: Buffer.alloc(16).toString("base64") }),
  );
});

test("credential and URL validation accepts safe values", () => {
  assert.equal(api.normalizeSite("example.com"), "https://example.com/");
  assert.equal(api.normalizeSite("javascript:alert(1)"), null);
  assert.equal(api.validEmail("demo@example.com"), true);
  assert.equal(api.validEmail("invalid"), false);
  assert.deepEqual(
    api.validateCredential({
      site: "example.com",
      username: "demo",
      password: "secret",
    }),
    {
      site: "https://example.com/",
      username: "demo",
      password: "secret",
    },
  );
});

test("rate limiter blocks requests after the configured count", () => {
  const middleware = api.enforceRateLimit(new Map(), 2, 60000, "blocked");
  const req = { ip: "127.0.0.1" };
  let nextCalls = 0;
  const next = () => {
    nextCalls += 1;
  };
  const res = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  middleware(req, res, next);
  middleware(req, res, next);
  middleware(req, res, next);
  assert.equal(nextCalls, 2);
  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, { error: "blocked" });
});

class FakeCollection {
  constructor(name, store) {
    this.name = name;
    this.store = store;
  }
  async findOne(query) {
    return this.store[this.name].find((item) => matches(item, query)) || null;
  }
  async insertOne(document) {
    const saved = { ...document, _id: document._id || new api.ObjectId() };
    this.store[this.name].push(saved);
    return { insertedId: saved._id };
  }
  find(query) {
    let rows = this.store[this.name].filter((item) => matches(item, query));
    return {
      sort: () => ({ toArray: async () => [...rows] }),
      toArray: async () => [...rows],
    };
  }
  async findOneAndUpdate(query, update) {
    const row = this.store[this.name].find((item) => matches(item, query));
    if (!row) return null;
    Object.assign(row, update.$set);
    return row;
  }
  async deleteOne(query) {
    const index = this.store[this.name].findIndex((item) =>
      matches(item, query),
    );
    if (index < 0) return { deletedCount: 0 };
    this.store[this.name].splice(index, 1);
    return { deletedCount: 1 };
  }
}

function sameValue(actual, expected) {
  if (expected && typeof expected === "object" && "$gt" in expected) {
    return actual > expected.$gt;
  }
  if (actual && expected && typeof actual.toString === "function") {
    return actual.toString() === expected.toString();
  }
  return actual === expected;
}
function matches(item, query) {
  return Object.entries(query).every(([key, expected]) =>
    sameValue(item[key], expected),
  );
}
function createFakeDatabase() {
  const store = { users: [], sessions: [], credentials: [] };
  return {
    store,
    collection(name) {
      return new FakeCollection(name, store);
    },
  };
}
async function jsonRequest(base, path, options = {}) {
  const response = await fetch(base + path, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

test("API registration, CRUD, encryption, logout, and owner isolation blocks cross-account access", async (context) => {
  const database = createFakeDatabase();
  api.setDatabaseForTests(database);
  const server = api.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  let result = await jsonRequest(base, "/api/credentials");
  assert.equal(result.response.status, 401);

  const userA = await jsonRequest(base, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "owner-a@example.com",
      password: "Owner-A-Password-123!",
    }),
  });
  assert.equal(userA.response.status, 201);
  const tokenA = userA.body.token;

  const userB = await jsonRequest(base, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "owner-b@example.com",
      password: "Owner-B-Password-123!",
    }),
  });
  assert.equal(userB.response.status, 201);
  const tokenB = userB.body.token;

  result = await jsonRequest(base, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "owner-a@example.com",
      password: "wrong-password",
    }),
  });
  assert.equal(result.response.status, 401);

  const created = await jsonRequest(base, "/api/credentials", {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      site: "example.com",
      username: "demo-a",
      password: "Plaintext-Must-Not-Persist",
    }),
  });
  assert.equal(created.response.status, 201);
  const credentialId = created.body.id;
  assert.equal(created.body.password, "Plaintext-Must-Not-Persist");
  const stored = database.store.credentials[0];
  assert.equal(stored.password, undefined);
  assert.notEqual(
    stored.passwordEncrypted.ciphertext,
    "Plaintext-Must-Not-Persist",
  );
  assert.equal(stored.passwordEncrypted.version, 1);

  const listB = await jsonRequest(base, "/api/credentials", {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert.equal(listB.response.status, 200);
  assert.deepEqual(listB.body, []);

  const crossUpdate = await jsonRequest(
    base,
    `/api/credentials/${credentialId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        site: "example.org",
        username: "intruder",
        password: "blocked",
      }),
    },
  );
  assert.equal(crossUpdate.response.status, 404);
  const crossDelete = await jsonRequest(
    base,
    `/api/credentials/${credentialId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenB}` },
    },
  );
  assert.equal(crossDelete.response.status, 404);

  result = await jsonRequest(base, "/api/credentials/not-an-object-id", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.equal(result.response.status, 400);

  const updated = await jsonRequest(base, `/api/credentials/${credentialId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      site: "example.org",
      username: "demo-a-updated",
      password: "Updated-Secret",
    }),
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.password, "Updated-Secret");

  result = await jsonRequest(base, "/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.equal(result.response.status, 204);
  result = await jsonRequest(base, "/api/credentials", {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.equal(result.response.status, 401);
});
