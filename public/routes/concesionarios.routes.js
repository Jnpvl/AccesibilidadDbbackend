"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Concesionarios_controller_1 = require("../controllers/Concesionarios.controller");
const router = (0, express_1.Router)();
router.get("/", Concesionarios_controller_1.getConcesionarios);
router.get("/report", Concesionarios_controller_1.getConcesionarioReport);
router.get("/excel", Concesionarios_controller_1.getConcesionarioExcel);
exports.default = router;
