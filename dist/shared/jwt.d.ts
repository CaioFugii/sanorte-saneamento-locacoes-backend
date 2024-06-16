type PayloadToken = {
    location: string;
    role: string;
};
declare const generateToken: (payload: PayloadToken) => string;
declare const verifyToken: (token: string) => {
    valid: boolean;
    decoded: string | import("jsonwebtoken").JwtPayload;
};
export { generateToken, verifyToken };
