"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionPool = void 0;
const pg_1 = require("pg");
exports.connectionPool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_URL,
});
exports.connectionPool.on("connect", () => {
    console.log("Base de Dados conectado com sucesso!");
});
exports.connectionPool.on("error", (err, _) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
//# sourceMappingURL=database-connection.js.map