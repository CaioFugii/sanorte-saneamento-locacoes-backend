import { ZodIssue, z } from "zod";

const LoginSchema = z.object({
  user: z.string({
    invalid_type_error: "user must be a string",
    required_error: "user is required",
  }),
  password: z.string({
    invalid_type_error: "password must be a string",
    required_error: "password is required",
  }),
});

interface ValidationResult<T> {
  valid: boolean;
  errors?: { property: string; message: string }[];
}

export const LoginSchemaValidator = {
  schema: LoginSchema,

  validate: (payload: unknown): ValidationResult<typeof LoginSchema._input> => {
    try {
      LoginSchema.parse(payload);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue: ZodIssue) => ({
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
