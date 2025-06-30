# NoteVault Notes API Backend

This backend provides a RESTful API for managing personal notes (CRUD), supporting organization by tags and categories, with all data persisted in a MongoDB database container.

---

## 🚦 Startup Requirements

> **Before starting the Notes API backend, you **must** ensure that the MongoDB service (`notes_database` container) is running and accessible. The backend cannot function or accept requests unless the database is available.**

---

## 📝 Quick Start: Development/Local

### 1. Start the Database Container

1. **Navigate to the `notes_database` workspace** (or use your orchestration method).
2. Start MongoDB, e.g.:
   - (Standalone) Run:  
     ```sh
     docker run --rm -p 27017:27017 --name notes_db mongo
     ```
   - (Compose/Orchestration)  
     Or launch using `docker-compose up notes_database`, if provided.
3. Wait until the database is ready (the port is open and accepts connections).

More instructions/optional parameters may be available in [`../notes_database/README.md`](../../notevault-api-95746-c92b5133/notes_database/README.md).

---

### 2. Set Environment Variables

The backend requires two environment variables for connecting to the database:

- `MONGODB_URL`: The MongoDB server URI (e.g., `mongodb://localhost:27017` or the correct hostname in your network)
- `MONGODB_DB`: The database name to use (e.g., `notesdb`)

You can supply them via a `.env` file in the backend root:

```
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=notesdb
```

Or export in your shell/session before starting:

```sh
export MONGODB_URL=mongodb://localhost:27017
export MONGODB_DB=notesdb
```

---

### 3. Start the Backend

In the backend directory, run:

```sh
npm install       # Install dependencies (only once if not done)
npm run dev       # For development (auto-reloads)
# or
npm start         # Production mode
```

The API will be available on `http://localhost:3000` (or as configured).

---

## 🔌 Connection and Troubleshooting

- **Backend will refuse all requests with a `503 Service Unavailable` error if the database is unreachable.**
  - You will see logs like `Failed to connect to MongoDB on startup: ...`
- **Common issues:**
  - Database container not running, port not exposed/forwarded.
  - Wrong `MONGODB_URL` or `MONGODB_DB`.
  - Network/firewall blocks between backend and database.
- **Test database connectivity:**
  - Use the mongo CLI:  
    `mongo "$MONGODB_URL/$MONGODB_DB"`
  - Or try connecting from a database GUI (Compass, etc).

---

## 📄 Additional References

- [notes_database/README.md](../../notevault-api-95746-c92b5133/notes_database/README.md) — for MongoDB container setup, environment, and parameters.
- Or see in your infrastructure orchestration tools.

---

## ℹ️ Backend Overview

- **Tech:** Node.js (Express), MongoDB (via Mongoose)
- **Start order:** Always start database first, then backend.
- **API Docs:** Interactive docs at `/docs` once backend is running.
