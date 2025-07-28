
---

# 🦫 Capibara.ts – Lightweight HTTP Framework for Node.js

[![npm version](https://img.shields.io/npm/v/capibara.ts?color=blue&style=flat-square)](https://www.npmjs.com/package/capibara.ts)
[![license](https://img.shields.io/npm/l/capibara.ts?color=brightgreen&style=flat-square)](./LICENSE)
[![typescript](https://img.shields.io/badge/built%20with-typescript-blue?style=flat-square)](https://www.typescriptlang.org/)

> Minimalist web framework with middleware support, input validation, and native `http` handling — inspired by Express, built from scratch in TypeScript.

---

## 🚀 Features

* ✅ **Native HTTP server & lightweight router**
* 🔁 **Middleware chaining** via `next()`
* 🔒 **Input validation** with `capyScrub()`
* 🧾 **Built-in body parser** for JSON & URL-encoded
* ⏱ `res.testStart()` / `res.testEnd()` to track response duration
* 📦 **Request/Response wrappers** for cleaner API
* 🦺 **Zero dependencies**, fully native
* 🧠 **Written in TypeScript** with full typings
* 🧩 Supports **modular routers** like `Router("/prefix")`

---

## 📦 Installation

```bash
npm install capibara.ts
````

Or clone manually:

```bash
git clone https://github.com/your-username/capibara.ts.git
cd capibara.ts
npm install
```

---

## 🛠 Quick Start

```ts
import capi from "capibara.ts";

capi.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Capibara!" });
});

capi.start(3000, "🔥 Server running at http://localhost:3000");
```

---

## 🔧 Global Middleware

```ts
capi.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
```

---

## 🧪 Input Validation with `capyScrub()`

```ts
import { capyScrub } from "capibara.ts";

capi.post(
  "/login",
  capyScrub({
    body: {
      username: "string",
      password: "string"
    }
  }),
  (req, res) => {
    const { username } = req.body;
    res.status(200).json({ welcome: username });
  }
);
```

---

## ⏱ Track Response Time

```ts
capi.get("/track", (req, res) => {
  res.testStart();

  setTimeout(() => {
    res.status(200).testEnd("Delayed response complete!");
  }, 150);
});
```

---

## 🧩 Grouping Routes with `Router`

```ts
import { Router } from "capibara.ts";

const userRouter = new Router("/user");

userRouter.get("/profile", (req, res) => {
  res.json({ user: "me" });
});

userRouter.post("/login", (req, res) => {
  res.json({ msg: "logged in" });
});

capi.use("/user", userRouter);
```

---

## 🧽 capyScrub Input Types

| Type        | Validates...           |
| ----------- | ---------------------- |
| `"string"`  | Must be a string       |
| `"number"`  | Must be a number       |
| `"boolean"` | Must be a boolean      |
| `"email"`   | Must match email regex |
| `"object"`  | Must be a plain object |
| `"array"`   | Must be an array       |

---

## 🧾 Request Wrapper (`req`)

| Property      | Description                   |
| ------------- | ----------------------------- |
| `req.body`    | Parsed JSON or form body      |
| `req.query`   | Parsed query string           |
| `req.ctx`     | Context object for middleware |
| `req.headers` | Request headers               |
| `req.method`  | HTTP method                   |
| `req.url`     | Raw URL                       |

---

## 📤 Response Wrapper (`res`)

| Method              | Description            |
| ------------------- | ---------------------- |
| `res.status(code)`  | Set HTTP status code   |
| `res.json(data)`    | Send JSON response     |
| `res.text(str)`     | Send plain text        |
| `res.testStart()`   | Start timing benchmark |
| `res.testEnd(data)` | End timing and respond |

---

## ✅ Example: Full Route

```ts
import { capi, capyScrub } from "capibara.ts";

capi.post(
  "/register",
  capyScrub({
    body: {
      email: "email",
      username: "string"
    }
  }),
  (req, res) => {
    res.status(201).json({ success: true });
  }
);
```

---

## ⚠️ Route Format Rules

All routes must match this format:

```regex
^\/[a-z0-9\-\/]*$
```

This keeps route paths clean and safe from malformed input.

---

## 🧪 Local Dev & Testing

Start the server with:

```bash
# Development
npx ts-node index.ts

# Or build and run
npx tsc && node dist/index.js
```

---

## 🔐 Error Handling

To send custom error response:

```ts
capi.use((req, res, next) => {
  try {
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```

> You can also wrap route handlers manually with try/catch if needed.

---

## 🧠 Typing Helpers

If you're getting type errors like:

```ts
'_req' implicitly has 'any' type
```

You can create a helper:

```ts
import type { Handler } from "capibara.ts";

export const defineHandler = (fn: Handler): Handler => fn;
```

Then use:

```ts
route.post("/login", defineHandler((_req, res) => {
  res.status(200).json({ msg: "login" });
}));
```
---

## 🌐 Enable CORS Middleware

Capibara.ts includes flexible CORS middleware support using `capi.use(cors())`. You can configure allowed origins, methods, headers, and credentials.

### 🔧 Setup Example

```ts
import { capi, cors } from "capibara.ts";

capi.use(cors({
  origin: ["http://localhost:5173", "https://myapp.com"],
  methods: "GET, POST, PUT, DELETE",
  headers: "Content-Type, Authorization",
  credentials: true
}));
```

> 🔒 This ensures your API only accepts requests from trusted origins and supports preflight handling automatically.

---

### 🔁 CORS Middleware Features

| Option        | Description                                            |
| ------------- | ------------------------------------------------------ |
| `origin`      | List of allowed origins (e.g., `["*"]`, or specific)   |
| `methods`     | Allowed HTTP methods (e.g., `"GET, POST"`)             |
| `headers`     | Allowed request headers                                |
| `credentials` | Support cookies/auth headers (must not use `*` origin) |
| `silent`      | Suppress console logs for blocked origins              |

---

### 🚫 Preflight Example

Capibara handles `OPTIONS` requests automatically with this middleware:

```http
OPTIONS /user/login HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

Your server will respond with:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---


## 🧪 New: Verbose Request Logging

Capibara now includes **built-in logging** that tracks:

* HTTP method and path
* Local timestamp (`HH:mm - YYYY/MM/DD`)
* IP address (`::1` or client IP)
* Response duration in milliseconds
* CORS status (✅ Allowed / ❌ Blocked)

Example:

```bash
POST: /user/register | 01:39 - 2025/07/29 | ::1 | 0.38ms ✅
GET: /user | 01:33 - 2025/07/29 | ::1 | 3.97ms ❌
```

---

## 🧩 Dynamic Route Parameters

Capibara now supports **dynamic segments** with parameter parsing:

```ts
capi.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const query = req.query; // e.g., ?a=1
  res.json({ id: userId, query });
});
```

This allows URLs like:

```http
GET /user/123?a=1&b=ok
```

Parsed as:

```json
{
  "id": "123",
  "query": {
    "a": "1",
    "b": "ok"
  }
}
```

> Dynamic segments use the `:` prefix and are accessible via `req.params`.

---

### 🛠 Example: Dynamic GET route

```ts
capi.get("/product/:productId", (req, res) => {
  res.json({
    product: req.params.productId,
    options: req.query
  });
});
```

---

## 🧠 Pro Tip: Middleware Logging

You can use `req.ctx` to track custom metadata across middlewares, for example:

```ts
capi.use((req, res, next) => {
  req.ctx.start = Date.now();
  next();
});
```

---

These new features add traceability and flexibility — and bring Capibara.ts closer to production-readiness.

---

## 📄 License

MIT © [Andrew Tangel](https://instagram.com/ndree_tngl)

> Capibara.ts was created to explore low-level HTTP handling with modern TypeScript. It's a minimalist yet powerful alternative to larger frameworks.

---

```

---
