"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aseguradoras_controller_1 = require("../controllers/aseguradoras.controller");
const router = (0, express_1.Router)();
router.get("/", aseguradoras_controller_1.getAseguradoras);
router.get("/report", aseguradoras_controller_1.getAseguradorasReport);
//router.get("/excel",getAseguradorasExcel)
exports.default = router;
