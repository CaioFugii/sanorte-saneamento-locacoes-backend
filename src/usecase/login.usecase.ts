import { LoginSchemaValidator } from "../routers/schema-validations/login-schema";
import { BadRequestError } from "../shared/bad-request-error";
import { HttpError } from "../shared/http-error";
import { generateToken } from "../shared/jwt";

export class LoginUseCase {
  private userLocations = [
    {
      userName: "admin@sanorte-saneamento",
      locations: [
        "Santos",
        "Cubatão",
        "São Sebastião",
        "Ilha bela",
        "São Vicente",
        "Guarujá",
        "Bertioga",
      ],
    },
    {
      userName: "operator-SC@sanorte-saneamento",
      locations: ["Santos", "Cubatão"],
    },
    {
      userName: "operator-SI@sanorte-saneamento",
      locations: ["São Sebastião", "Ilha bela"],
    },
    {
      userName: "operator-SV@sanorte-saneamento",
      locations: ["São Vicente"],
    },
    {
      userName: "operator-GB@sanorte-saneamento",
      locations: ["Guarujá", "Bertioga"],
    },
  ];

  execute(payload: { user: string; password: string }) {
    const { valid, errors } = LoginSchemaValidator.validate(payload);

    if (!valid) {
      throw new BadRequestError(errors);
    }

    const allowedUsers = String(process.env.ALLOWED_USERS)
      .split(";")
      .map((value) => {
        const [user, correctPassword, role] = value.split(":");
        const { locations } = this.userLocations.find(
          (element) => element.userName === user
        );

        if (!locations) {
          throw new Error(`User not found: ${user}`);
        }

        return {
          user,
          correctPassword,
          locations,
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
        user: foundUser.user,
        locations: foundUser.locations,
        role: foundUser.role,
      }),
    };
  }
}
