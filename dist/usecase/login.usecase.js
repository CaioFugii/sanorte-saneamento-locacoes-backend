"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const login_schema_1 = require("../routers/schema-validations/login-schema");
const bad_request_error_1 = require("../shared/bad-request-error");
const http_error_1 = require("../shared/http-error");
const jwt_1 = require("../shared/jwt");
class LoginUseCase {
    execute(payload) {
        const { valid, errors } = login_schema_1.LoginSchemaValidator.validate(payload);
        if (!valid) {
            throw new bad_request_error_1.BadRequestError(errors);
        }
        const allowedUsers = String(process.env.ALLOWED_USERS)
            .split(";")
            .map((value) => {
            const [user, correctPassword, location, role] = value.split(":");
            return {
                user,
                correctPassword,
                location,
                role,
            };
        });
        const foundUser = allowedUsers.find(({ user, correctPassword }) => user === payload.user && correctPassword === payload.password);
        if (!foundUser) {
            throw new http_error_1.HttpError("Invalid credentials", 400);
        }
        return {
            token: (0, jwt_1.generateToken)({
                location: foundUser.location,
                role: foundUser.role,
            }),
        };
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=login.usecase.js.map