# NexLockr

NexLockr is a full-stack encrypted credential vault built with React, Express, and MongoDB. The project was developed as a standalone application and is also presented in my professional portfolio.

> **Portfolio security notice:** NexLockr demonstrates authentication, owner isolation, and authenticated encryption. It has not undergone an independent security audit and should not be treated as a commercial password manager. Use fictional demonstration credentials in the public deployment.

## Security model

- Account passwords are protected with Node.js `scrypt` and unique random salts.
- Saved credential passwords are protected with AES-256-GCM authenticated encryption before MongoDB storage.
- Encryption keys are supplied only through backend environment variables.
- Sessions use random bearer tokens; only SHA-256 token hashes are stored in MongoDB.
- Every credential query includes the authenticated owner identifier.
- CORS is restricted through `FRONTEND_ORIGIN`.
- Old plaintext records in the former `PassOP.passwords` collection are not exposed by the new API.

## Features

- Registration, sign-in, sign-out, and expiring sessions
- Owner-isolated encrypted credentials
- Create, update, delete, reveal, and copy actions
- Strict URL and request validation
- Loading, empty, error, and busy states
- Responsive credential cards and keyboard-accessible controls
- Netlify-ready frontend and Render-ready API configuration

## Local setup

Requirements: Node.js 20.19 or later, npm, and MongoDB.

```bash
npm install
cd backend
npm install
```

Copy the example environment files:

```text
.env.example -> .env
backend/.env.example -> backend/.env
```

Generate a backend encryption key without printing or committing a production key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Start the backend:

```bash
cd backend
npm start
```

Start the frontend in another terminal:

```bash
npm run dev
```

## Environment variables

Frontend:

- `VITE_API_BASE_URL`: API origin, such as `http://localhost:3000`

Backend:

- `MONGO_URI`: MongoDB connection string
- `DB_NAME`: database name, defaults to `NexLockr`
- `FRONTEND_ORIGIN`: comma-separated permitted frontend origins
- `VAULT_ENCRYPTION_KEY`: base64-encoded 32-byte encryption key
- `SESSION_HOURS`: optional session lifetime
- `PORT`: optional API port

## Deployment

Deploy the API first and configure all backend environment variables. Then set `VITE_API_BASE_URL` for the frontend and deploy it. Never commit `.env` files or production keys.

## Legacy data

The previous implementation stored records without authentication or encryption in `PassOP.passwords`. Clear that legacy collection after exporting only fictional data. If any genuine password was ever entered, change it at the original service.

## Author

**Neeraj Kumar Saini**<br>
MERN Stack Developer<br>
[GitHub](https://github.com/NeerajSaini271)
