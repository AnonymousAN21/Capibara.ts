import { Middleware } from "../main/capi";
const DEFAULT_METHODS = "GET, POST, PUT, DELETE, OPTIONS";
const DEFAULT_HEADERS = "Content-Type, Authorization";

type CorsOptions = {
  origin: string[];       
  methods?: string;
  headers?: string;
  credentials?: boolean;
  silent?: boolean;
};

export const cors = (options: CorsOptions): Middleware => {
  const allowedOrigins = new Set(options.origin.map(o => o.toLowerCase()));
  const allowAll = options.origin.includes("*");

  return (req, res, next) => {
    const origin = (req.getHeader("origin") || "").trim();
    const requestMethod = req.getHeader("access-control-request-method");
    const requestHeaders = req.getHeader("access-control-request-headers");
   
    if (origin === "null" && !allowAll) {
        return res.status(403).json({ error: "CORS blocked: null origin not allowed" });
    }

    if (!allowAll && (!origin || !allowedOrigins.has(origin.toLowerCase()))) {
        if (!options.silent) console.warn(`Blocked CORS request from ${origin}`);
        return res.status(403).json({ error: `CORS blocked: Origin ${origin} not allowed` });
    }


    if (options.credentials) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", allowAll && !options.credentials ? "*" : origin);
    res.setHeader("Access-Control-Allow-Methods", options.methods || requestMethod || DEFAULT_METHODS);
    res.setHeader("Access-Control-Allow-Headers", options.headers || requestHeaders || DEFAULT_HEADERS);


    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    next();
  };
};
