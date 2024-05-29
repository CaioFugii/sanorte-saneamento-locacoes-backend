import { sign, verify } from "jsonwebtoken";

type PayloadToken = {
  location: string;
  role: string;
};

const generateToken = (payload: PayloadToken) =>
  sign(payload, process.env.SECRET_JWT, { expiresIn: "7d" });

const verifyToken = (token: string) => {
  try {
    const decoded = verify(token, process.env.SECRET_JWT);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, decoded: null };
  }
};

export { generateToken, verifyToken };
