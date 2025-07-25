
---

# 🦫 Capibara.ts – Lightweight HTTP Framework for Node.js

[![npm version](https://img.shields.io/npm/v/capibara.ts?color=blue\&style=flat-square)](https://www.npmjs.com/package/capibara.ts)
[![license](https://img.shields.io/npm/l/capibara.ts?color=brightgreen\&style=flat-square)](./LICENSE)
[![typescript](https://img.shields.io/badge/built%20with-typescript-blue?style=flat-square)](https://www.typescriptlang.org/)

> Minimalist web framework with middleware support, input validation, and native `http` handling — inspired by Express, built from scratch in TypeScript.

---

## 🚀 Features

* ✅ **HTTP server & custom routing**
* 🧩 **Middleware chaining** with `next()`
* 🧾 **Body parser**: JSON & URL-encoded
* 🧪 `res.testStart()` and `res.testEnd()` for request speed tracking
* 🔍 `capyScrub()` – built-in input validator
* 🛠 **Request/Response wrappers**
* 🦺 **Zero dependencies**, native-only
* 📦 **Written in TypeScript** with full typings

---

## 📦 Installation

```bash
npm install capibara.ts
```

Or clone from GitHub:

```bash
git clone https://github.com/your-username/capibara.ts.git
cd capibara.ts
npm install
```

---

## 🛠 Quick Usage

```ts
import capi from "capibara.ts";

capi.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Capibara!" });
});

capi.start(3000, "🔥 Server running at http://localhost:3000");
```

---

## 🔧 Middleware Example

```ts
capi.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
```

---

## 🧽 Input Validation with `capyScrub()`

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
    res.status(200).testEnd("Done in delay!");
  }, 150);
});
```

---

## 📚 API Reference

### capi.get(path, ...handlers)

Register a `GET` route.

### capi.post(path, ...handlers)

Register a `POST` route.

### capi.use(...middlewares)

Attach global middleware.

---

## 🔧 `Request` Wrapper (`req`)

| Property      | Description                     |
| ------------- | ------------------------------- |
| `req.body`    | Parsed JSON or URL-encoded body |
| `req.query`   | Parsed query string             |
| `req.params`  | (reserved for future routing)   |
| `req.headers` | Normalized headers              |
| `req.method`  | HTTP method                     |
| `req.url`     | Raw URL                         |

---

## 🔧 `Response` Wrapper (`res`)

| Method              | Description                       |
| ------------------- | --------------------------------- |
| `res.status(code)`  | Set HTTP status                   |
| `res.json(data)`    | Send JSON response                |
| `res.text(str)`     | Send plain text response          |
| `res.testStart()`   | Start duration timer              |
| `res.testEnd(data)` | End timer and respond with timing |

---

## 🧽 `capyScrub` Input Types

| Type        | Validates...           |
| ----------- | ---------------------- |
| `"string"`  | Must be a string       |
| `"number"`  | Must be a number       |
| `"boolean"` | Must be a boolean      |
| `"email"`   | Must match email regex |
| `"object"`  | Must be a plain object |
| `"array"`   | Must be an array       |

---

## ✅ Example

```ts
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

## ❗ Route Rules

All routes must match:

```regex
^\/[a-z0-9\-\/]*$
```

This prevents malformed or unsafe routes.

---

## 📂 Folder Structure (after build)

```
capibara.ts/
├── capi/
│   ├── main/           # core engine
│   ├── handler/        # request & response wrappers
│   └── middleware/     # sanitizers
├── dist/               # output after tsc build
├── index.ts            # entry point
├── package.json
└── README.md
```

---

## 🧪 Local Dev & Testing

Use `ts-node` or native build:

```bash
# Start dev with ts-node
npx ts-node index.ts

# OR build to JS then run
npx tsc && node dist/index.js
```

---

## 📄 License

MIT © [Andrew Tangel](https://instagram.com/ndree_tngl)

This framework was built to explore native HTTP design patterns with middleware, validation, and wrapper control — a minimalist alternative to larger frameworks like Express.

---


