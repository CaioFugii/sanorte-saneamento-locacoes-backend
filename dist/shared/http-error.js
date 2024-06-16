"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, code) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message || "Internal server error.";
        this.code = code || 500;
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map