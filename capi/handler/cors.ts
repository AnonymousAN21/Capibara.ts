import { Middleware } from "../main/capi";

type CorsOptions = {
  Origin: string[];       // Allowed origin domains (e.g., http://localhost:5173)
  Methods?: string;
  Headers?: string;
};

export const cors = (options: CorsOptions): Middleware => {
  const allowedOrigins = new Set(options.Origin);
  const allowAll = options.Origin.includes("*");

  return (req, res, next) => {
    const origin = req.getHeader("origin");

    if (!allowAll && (!origin || !allowedOrigins.has(origin))) {
      return res.status(403).json({ error: `CORS blocked: Origin ${origin} not allowed` });
    }

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", options.Methods || "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", options.Headers || "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    next();
  };
};
