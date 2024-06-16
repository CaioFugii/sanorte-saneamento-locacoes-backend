"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const middlewares_1 = __importDefault(require("./middlewares"));
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", middlewares_1.default.limiter, middlewares_1.default.speedLimiter, (_, res) => {
    res.status(200).json({
        message: "🤯",
    });
});
app.use("/api/", routers_1.default);
app.use(middlewares_1.default.notFound);
app.use(middlewares_1.default.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map