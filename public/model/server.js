"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("../routes"));
const database_1 = require("../config/database");
class Server {
    constructor() {
        this.PORT = process.env.PORT || 8080;
        this.app = (0, express_1.default)();
        this.config();
        this.router();
        this.database();
    }
    database() {
        return (0, database_1.initializeDatabases)()
            .then(() => {
            console.log("Todas las bases de datos han sido inicializadas correctamente.");
        })
            .catch((error) => {
            console.error("Error conectando a las bases de datos:", error);
            process.exit(1);
        });
    }
    config() {
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
        this.app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../../src/assets')));
    }
    router() {
        this.app.use("/api/v1", routes_1.default);
    }
    start() {
        this.app.listen(this.PORT, () => {
            console.log(`Server running at http://localhost:${this.PORT}`);
        });
    }
}
exports.default = Server;
