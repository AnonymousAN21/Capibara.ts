// index.ts
import { capi } from "./capi/main/capi";
import type { Middleware } from "./capi/main/capi";
import { Response } from "./capi/handler/response";
import { Request } from "./capi/handler/request";

export default capi;

// Optional named exports
export type { Middleware };
export { Response, Request };
