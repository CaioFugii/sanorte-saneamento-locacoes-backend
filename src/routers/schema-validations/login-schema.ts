import { ZodIssue, z } from "zod";

const LoginSchema = z.object({
  location: z.string({
    invalid_type_error: "location must be a string",
    required_error: "location is required",
  }),
  role: z.string({
    invalid_type_error: "role must be a string",
    required_error: "role is required",
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
