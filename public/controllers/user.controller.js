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
exports.getUsers = exports.updateUser = exports.createUser = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuarios_entities_1 = require("../entities/usuarios.entities");
const database_1 = require("../config/database");
const jwt_utils_1 = require("../utils/jwt.utils");
const getPaginatedData_utils_1 = require("../utils/getPaginatedData.utils");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Se requieren usuario y contraseña." });
            return;
        }
        const userRepository = database_1.UserDataSource.getRepository(usuarios_entities_1.User);
        const user = yield userRepository.findOne({ where: { username } });
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Contraseña incorrecta." });
            return;
        }
        if (user.status !== "Activo") {
            res.status(403).json({ message: "Usuario inactivo. Contacte al administrador." });
            return;
        }
        const token = (0, jwt_utils_1.generateJWT)({ id: user.id, username: user.username, role: user.role });
        res.status(200).json({ message: "Inicio de sesión exitoso.", user, token });
    }
    catch (error) {
        console.error("Error en loginUser:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});
exports.loginUser = loginUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, Name, ApellidoP, ApellidoM, password, canExportExcel, canExportPdf, canCreateUser } = req.body;
        if (!role || !Name || !ApellidoP || !password) {
            res.status(400).json({ message: "Faltan datos obligatorios: role, Name, ApellidoP y password." });
            return;
        }
        const baseUsername = (Name[0] + ApellidoP).toLowerCase();
        let uniqueUsername = baseUsername;
        let counter = 0;
        const userRepository = database_1.UserDataSource.getRepository(usuarios_entities_1.User);
        while (yield userRepository.findOne({ where: { username: uniqueUsername } })) {
            counter++;
            uniqueUsername = baseUsername + counter;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = userRepository.create({
            role,
            Name,
            ApellidoP,
            ApellidoM: ApellidoM || "",
            username: uniqueUsername,
            password: hashedPassword,
            status: "Activo",
            canExportExcel: canExportExcel || false,
            canExportPdf: canExportPdf || false,
            canCreateUser: canCreateUser !== undefined ? canCreateUser : true,
        });
        yield userRepository.save(newUser);
        res.status(201).json({ message: "Usuario creado exitosamente.", user: newUser });
    }
    catch (error) {
        console.error("Error en createUser:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const { role, Name, ApellidoP, ApellidoM, password, status, canExportExcel, canExportPdf, canCreateUser } = req.body;
        const userRepository = database_1.UserDataSource.getRepository(usuarios_entities_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        }
        if (role)
            user.role = role;
        if (Name)
            user.Name = Name;
        if (ApellidoP)
            user.ApellidoP = ApellidoP;
        if (ApellidoM !== undefined)
            user.ApellidoM = ApellidoM;
        if (status)
            user.status = status;
        if (canExportExcel !== undefined)
            user.canExportExcel = canExportExcel;
        if (canExportPdf !== undefined)
            user.canExportPdf = canExportPdf;
        if (canCreateUser !== undefined)
            user.canCreateUser = canCreateUser;
        if (password) {
            user.password = yield bcryptjs_1.default.hash(password, 10);
        }
        if (Name || ApellidoP) {
            const newUsername = ((Name || user.Name)[0] + (ApellidoP || user.ApellidoP)).toLowerCase();
            user.username = newUsername;
        }
        yield userRepository.save(user);
        res.status(200).json({ message: "Usuario actualizado correctamente.", user });
    }
    catch (error) {
        console.error("Error en updateUser:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});
exports.updateUser = updateUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        tableName: "usuarios",
        orderByColumn: "id",
        searchFields: ["role", "Name", "ApellidoP", "ApellidoM", "username"]
    };
    yield (0, getPaginatedData_utils_1.getPaginatedData)(req, res, options, database_1.UserDataSource);
});
exports.getUsers = getUsers;
