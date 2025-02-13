"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PermisosEstadisticas_controller_1 = require("../controllers/PermisosEstadisticas.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
router.get("/general", [verifyToken_1.verifyToken], PermisosEstadisticas_controller_1.getStatisticsPermisos);
router.get("/municipios", [verifyToken_1.verifyToken], PermisosEstadisticas_controller_1.getStatisticsMunicipios);
exports.default = router;
