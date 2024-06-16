"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_connection_1 = require("./repository/database-connection");
const PORT = Number(process.env.PORT);
const bootstrap = async () => {
    try {
        await database_connection_1.connectionPool.connect();
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to initialize the database connection", err);
        process.exit(1);
    }
};
bootstrap();
//# sourceMappingURL=index.js.map