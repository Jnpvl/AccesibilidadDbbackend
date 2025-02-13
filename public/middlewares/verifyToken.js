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
exports.verifyToken = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        req.user = decoded.payload;
        next();
    }
    catch (error) {
        console.error("Error en verifyToken:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
exports.verifyToken = verifyToken;
