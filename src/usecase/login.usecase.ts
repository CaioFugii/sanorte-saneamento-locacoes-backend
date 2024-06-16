import { LoginSchemaValidator } from "../routers/schema-validations/login-schema";
import { BadRequestError } from "../shared/bad-request-error";
import { HttpError } from "../shared/http-error";
import { generateToken } from "../shared/jwt";

export class LoginUseCase {
  execute(payload: { user: string; password: string }) {
    const { valid, errors } = LoginSchemaValidator.validate(payload);

    if (!valid) {
      throw new BadRequestError(errors);
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

    const foundUser = allowedUsers.find(
      ({ user, correctPassword }) =>
        user === payload.user && correctPassword === payload.password
    );

    if (!foundUser) {
      throw new HttpError("Invalid credentials", 400);
    }

    return {
      token: generateToken({
        location: foundUser.location,
        role: foundUser.role,
      }),
    };
  }
}
