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

    const allowedUsers = [
      {
        user: "admin@sanorte-saneamento",
        correctPassword: "SN2504",
        location: "*",
        role: "admin",
      },
      {
        user: "operator-SC@sanorte-saneamento",
        correctPassword: "SC2504",
        location: "Santos - Cubatão",
        role: "operator",
      },
      {
        user: "operator-SI@sanorte-saneamento",
        correctPassword: "SI2504",
        location: "São Sebastião - Ilha bela",
        role: "operator",
      },
      {
        user: "operator-SV@sanorte-saneamento",
        correctPassword: "SV2504",
        location: "São Vicente",
        role: "operator",
      },
    ];

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
