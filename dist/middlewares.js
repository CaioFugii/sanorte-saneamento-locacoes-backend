"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_1 = require("./shared/http-error");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_slow_down_1 = __importDefault(require("express-slow-down"));
const jwt_1 = require("./shared/jwt");
const bad_request_error_1 = require("./shared/bad-request-error");
const notFound = (req, res, next) => {
    res.status(404);
    const error = new http_error_1.HttpError(`🔍🧐 - Route Not Found - ${req.originalUrl}`, 404);
    next(error);
};
const authToken = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res
            .status(401)
            .json({ message: "Unauthorized: Missing 'Authorization' header. 🔐" });
    }
    const { decoded, valid } = (0, jwt_1.verifyToken)(auth);
    if (!valid) {
        return res
            .status(401)
            .json({ message: "Unauthorized: Invalid or expired token. 🔐" });
    }
    req.headers.authorization = JSON.stringify(decoded);
    next();
};
const errorHandler = (err, _, res, __) => {
    if (err instanceof bad_request_error_1.BadRequestError) {
        const { errors, stack } = err;
        return res.status(400).json({
            message: "Bad request error",
            errors,
            stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
        });
    }
    if (err instanceof http_error_1.HttpError) {
        const { code, message, stack } = err;
        return res.status(code).json({
            message,
            stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
        });
    }
    else {
        const { stack } = err;
        return res.status(500).json({
            message: err.message,
            stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
        });
    }
};
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 1000,
    max: 5,
});
const speedLimiter = (0, express_slow_down_1.default)({
    windowMs: 15 * 60 * 1000,
    delayAfter: 5,
    delayMs: (hits) => hits * 100,
});
exports.default = {
    notFound,
    authToken,
    errorHandler,
    limiter,
    speedLimiter,
};
//# sourceMappingURL=middlewares.js.map