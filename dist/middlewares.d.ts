/// <reference types="qs" />
import { NextFunction, Request, Response } from "express";
declare const _default: {
    notFound: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
    authToken: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Response<any, Record<string, any>>;
    errorHandler: (err: Error, _: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, __: NextFunction) => Response<any, Record<string, any>>;
    limiter: import("express-rate-limit").RateLimitRequestHandler;
    speedLimiter: import("express-rate-limit").RateLimitRequestHandler;
};
export default _default;
