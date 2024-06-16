"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateToken = (payload) => (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_JWT, { expiresIn: "7d" });
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.SECRET_JWT);
        return { valid: true, decoded };
    }
    catch (err) {
        return { valid: false, decoded: null };
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map