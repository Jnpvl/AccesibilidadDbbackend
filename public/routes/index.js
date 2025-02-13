"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aseguradoras_routes_1 = __importDefault(require("./aseguradoras.routes"));
const concesionarios_routes_1 = __importDefault(require("./concesionarios.routes"));
const permisos_routes_1 = __importDefault(require("./permisos.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const permisos_Estadisticas_routes_1 = __importDefault(require("./permisos.Estadisticas.routes"));
const v1Router = (0, express_1.Router)();
v1Router.use("/aseguradoras", aseguradoras_routes_1.default);
v1Router.use("/concesionarios", concesionarios_routes_1.default);
v1Router.use("/permisos", permisos_routes_1.default);
v1Router.use("/users", users_routes_1.default);
v1Router.use("/permisosStats", permisos_Estadisticas_routes_1.default);
exports.default = v1Router;
