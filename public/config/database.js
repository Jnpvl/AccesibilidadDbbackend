"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabases = exports.seedAdminUser = exports.PermisosDataSource = exports.ConcesionesDataSource = exports.UserDataSource = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const usuarios_entities_1 = require("../entities/usuarios.entities");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: process.env.DB_HOST || "database",
    port: Number(process.env.DB_PORT) || 1433,
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});
exports.UserDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: process.env.DB_LOGIN_HOST || "database",
    port: Number(process.env.DB_LOGIN_PORT) || 1433,
    username: process.env.DB_LOGIN_USER || "",
    password: process.env.DB_LOGIN_PASSWORD || "",
    database: process.env.DB_LOGIN_NAME || "",
    entities: [usuarios_entities_1.User],
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});
exports.ConcesionesDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: process.env.DB_CONCESIONES_HOST || "database",
    port: Number(process.env.DB_CONCESIONES_PORT) || 1433,
    username: process.env.DB_CONCESIONES_USER || "",
    password: process.env.DB_CONCESIONES_PASSWORD || "",
    database: process.env.DB_CONCESIONES_NAME || "",
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});
exports.PermisosDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: process.env.DB_PERMISOS_HOST || "database",
    port: Number(process.env.DB_PERMISOS_PORT) || 1433,
    username: process.env.DB_PERMISOS_USER || "",
    password: process.env.DB_PERMISOS_PASSWORD || "",
    database: process.env.DB_PERMISOS_NAME || "",
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});
const seedAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = exports.UserDataSource.getRepository(usuarios_entities_1.User);
        const adminExists = yield userRepository.findOne({ where: { role: 'administrador' } });
        if (!adminExists) {
            const hashedPassword = yield bcryptjs_1.default.hash("Se20sepaad80$", 10); // Funciona con bcryptjs ✅
            const adminUser = userRepository.create({
                role: 'administrador',
                Name: 'Administrador',
                ApellidoM: 'Administrador',
                ApellidoP: 'Administrador',
                username: 'admin',
                password: hashedPassword,
                status: 'Activo',
                canExportExcel: true,
                canExportPdf: true,
                canCreateUser: true,
            });
            yield userRepository.save(adminUser);
            console.log("Usuario administrador creado exitosamente.");
        }
        else {
            console.log("El usuario administrador ya existe.");
        }
    }
    catch (error) {
        console.error("Error en el seeding del usuario administrador:", error);
    }
});
exports.seedAdminUser = seedAdminUser;
const initializeDatabases = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.UserDataSource.initialize();
        console.log("Conectado a la base de datos de usuarios");
        yield (0, exports.seedAdminUser)();
        yield exports.ConcesionesDataSource.initialize();
        console.log("Conectado a la base de datos de concesiones");
        yield exports.PermisosDataSource.initialize();
        console.log("Conectado a la base de datos de permisos");
    }
    catch (error) {
        console.error("Error conectando a las bases de datos:", error);
    }
});
exports.initializeDatabases = initializeDatabases;
