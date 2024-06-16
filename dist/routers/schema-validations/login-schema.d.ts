import { z } from "zod";
declare const LoginSchema: z.ZodObject<{
    user: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user?: string;
    password?: string;
}, {
    user?: string;
    password?: string;
}>;
interface ValidationResult<T> {
    valid: boolean;
    errors?: {
        property: string;
        message: string;
    }[];
}
export declare const LoginSchemaValidator: {
    schema: z.ZodObject<{
        user: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        user?: string;
        password?: string;
    }, {
        user?: string;
        password?: string;
    }>;
    validate: (payload: unknown) => ValidationResult<typeof LoginSchema._input>;
};
export {};
