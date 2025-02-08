import { Router } from "express";
import { getConcesionarioExcel, getConcesionarioReport, getConcesionarios } from "../controllers/Concesionarios.controller";

const router = Router();

router.get("/", getConcesionarios);
router.get("/report", getConcesionarioReport);
router.get("/excel",getConcesionarioExcel)

export default router;