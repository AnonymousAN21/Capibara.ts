
---

## 📦 Capibara.ts – A Lightweight Middleware-Centric HTTP Framework for Node.js

Capibara is a lightweight and minimalist web framework built on top of Node.js’s native `http` module. It provides a custom routing system with support for middleware chaining and expressive request/response wrappers, similar to Express.js — but built from scratch.

---

## 🚀 Features

* 🌐 HTTP route handling (`GET`, `POST`)
* 🧩 Middleware support (with `next()` chaining)
* 🧾 Body parser for JSON and form-urlencoded
* 🛠 Custom `RequestWrapper` and `ResponseWrapper` classes
* 📉 Built-in response time tracking with `res.testStart()` and `res.testEnd()`
* ⚠️ Route validation with URL pattern checking
* 🧪 Manual but powerful routing system

---

## 📦 Installation

This is a codebase module, so just import or clone it into your project:

```bash
git clone https://github.com/your-username/capibara.ts.git
cd capibara.ts
npm install
```

---

## 🛠 Usage

### 1. Register Routes

```ts
import { capi } from "./capi";

const users: string[] = [];

capi.post("/test",
  (req, res, next) => {
    res.testStart(); // ⏱ Start timer
    if (req.headers.authorization !== "andrew") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  },
  (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "No Username" });
    }

    if (users.includes(username)) {
      return res.status(422).json({ error: "Username already exists" });
    }

    users.push(username);
    res.status(200).testEnd("User inserted!");
  }
);
```

---

### 2. Start the Server

```ts
capi.start(3000, "🔥 Server running on http://localhost:3000");
```

---

## 📚 API Reference

### 📌 `capi.get(endpoint, ...handlers)`

Register a `GET` route.

### 📌 `capi.post(endpoint, ...handlers)`

Register a `POST` route.

* `endpoint`: must match pattern `^\/[a-z0-9\-\/]*$`
* `...handlers`: middleware functions + final handler

---

### 📌 `capi.use(...middlewares)`

Apply global middleware to all existing routes.

```ts
capi.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
```

---

### 🔧 RequestWrapper (`req`)

Available in all route handlers:

* `req.body`: parsed JSON or form data
* `req.query`: parsed query parameters
* `req.headers`: normalized headers
* `req.method`, `req.url`

---

### 🔧 ResponseWrapper (`res`)

Available in all route handlers:

* `res.status(code)`: set HTTP status
* `res.json(obj)`: respond with JSON
* `res.text(str)`: respond with plain text
* `res.testStart()`: begin timing
* `res.testEnd(obj)`: end timing and respond with timing + payload

---

## ✅ Example

```ts
capi.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Capibara!" });
});
```

---

## ❗ URL Pattern Rules

* All route paths must match regex: `^\/[a-z0-9\-\/]*$`
* This prevents invalid or unsafe route registrations

---

## 📄 License

MIT © Andrew Tangel — This framework is a minimal educational/custom HTTP server.

---

