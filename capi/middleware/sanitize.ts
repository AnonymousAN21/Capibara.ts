import { Middleware } from "../main/capi";
import { Response } from "../handler/response";
type CapySanitizeType =
  | "string"
  | "number"
  | "boolean"
  | "email"
  | "object"
  | "array"
  | "enum"; // for future use

type CapySanitizeSchema = {
  url?: {
    query?: Record<string, CapySanitizeType>;
    params?: Record<string, CapySanitizeType>;
  };
  header?: Record<string, CapySanitizeType>;
  body?: Record<string, CapySanitizeType>;
};

export const capyScrub = (schema: CapySanitizeSchema): Middleware => {
  return (
    req,
    res,
    next,
  ) => {
    try {
      // Validate query and params if defined
      if (schema.url) {
        const { query = {}, params = {} } = schema.url;
        if (query) validateFields("query", query, req.query, res);
        if (params) validateFields("params", params, req.params, res);
      }

      // Validate headers if defined
      if (schema.header) {
        validateFields("header", schema.header, req.headers, res);
      }

      // Validate body if defined
      if (schema.body) {
        validateFields("body", schema.body, req.body, res);
      }

      next();
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
};

function validateFields(
  section: string,
  schema: Record<string, CapySanitizeType>,
  data: any,
  res: Response
) {
  for (const key in schema) {
    const expected = schema[key];
    const value = data?.[key];

    if (value === undefined || value === null) {
      throw new Error(`Missing ${section}.${key}`);
    }

    switch (expected) {
      case "string":
        if (typeof value !== "string")
          throw new Error(`${section}.${key} must be a string`);
        break;
      case "number":
        if (typeof value !== "number")
          throw new Error(`${section}.${key} must be a number`);
        break;
      case "boolean":
        if (typeof value !== "boolean")
          throw new Error(`${section}.${key} must be a boolean`);
        break;
      case "email":
        if (
          typeof value !== "string" ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        )
          throw new Error(`${section}.${key} must be a valid email`);
        break;
      case "object":
        if (typeof value !== "object" || Array.isArray(value))
          throw new Error(`${section}.${key} must be an object`);
        break;
      case "array":
        if (!Array.isArray(value))
          throw new Error(`${section}.${key} must be an array`);
        break;
    }
  }
}
