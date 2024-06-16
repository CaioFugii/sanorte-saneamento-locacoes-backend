"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const http_error_1 = require("./http-error");
class BadRequestError extends http_error_1.HttpError {
    constructor(errors) {
        super("Bad request error", 400);
        this.name = this.constructor.name;
        this.errors = errors;
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=bad-request-error.js.map