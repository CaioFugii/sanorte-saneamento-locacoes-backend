"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchemaValidator = void 0;
const zod_1 = require("zod");
const LoginSchema = zod_1.z.object({
    user: zod_1.z.string({
        invalid_type_error: "user must be a string",
        required_error: "user is required",
    }),
    password: zod_1.z.string({
        invalid_type_error: "password must be a string",
        required_error: "password is required",
    }),
});
exports.LoginSchemaValidator = {
    schema: LoginSchema,
    validate: (payload) => {
        try {
            LoginSchema.parse(payload);
            return { valid: true };
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errors = error.issues.map((issue) => ({
                    property: issue.path[0]?.toString() ?? "",
                    message: issue.message,
                }));
                return { valid: false, errors };
            }
            return {
                valid: false,
                errors: [{ property: "unknown", message: "An unknown error occurred" }],
            };
        }
    },
};
//# sourceMappingURL=login-schema.js.map