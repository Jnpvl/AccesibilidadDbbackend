"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const generateJWT = (payload) => {
    const token = jsonwebtoken_1.default.sign({ payload }, JWT_SECRET, {
        expiresIn: 7 * 86400
    });
    return token;
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error("error verificando jwt:", error);
        return null;
    }
};
exports.verifyJWT = verifyJWT;
