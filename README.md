
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

## 📄 License

MIT © [Andrew Tangel](https://instagram.com/ndree_tngl)

> Capibara.ts was created to explore low-level HTTP handling with modern TypeScript. It's a minimalist yet powerful alternative to larger frameworks.

---

```

---
