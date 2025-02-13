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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCreatePermission = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const database_1 = require("../config/database");
const usuarios_entities_1 = require("../entities/usuarios.entities");
const requireCreatePermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "No se proporcionó el token." });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Formato de token inválido." });
            return;
        }
        const decoded = (0, jwt_utils_1.verifyJWT)(token);
        if (!decoded) {
            res.status(401).json({ message: "Token no válido." });
            return;
        }
        const userId = decoded.payload.id;
        const userRepository = database_1.UserDataSource.getRepository(usuarios_entities_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(401).json({ message: "Usuario no encontrado." });
            return;
        }
        if (!user.canCreateUser) {
            res.status(403).json({ message: "No tienes permisos para crear o actualizar usuarios." });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error en requireCreatePermission:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
exports.requireCreatePermission = requireCreatePermission;
