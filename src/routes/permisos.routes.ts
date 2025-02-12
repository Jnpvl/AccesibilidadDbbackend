import { Router } from "express";
import { getPermisionarioData, getPermisionarioExcel, getPermisoReport, getPermisos, getPermisosExcel, getPermisosReport } from "../controllers/Permisos.controller";
import { requireExportExcel } from "../middlewares/requireExportExcel";
import { requireExportPDF } from "../middlewares/requireExportPdf";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();

router.get("/", [verifyToken],getPermisos);
router.get("/permisionario", [verifyToken],getPermisionarioData);

router.get("/reports",[requireExportPDF], getPermisosReport);
router.get("/excel",[requireExportExcel],getPermisosExcel)
router.get("/permisionarioExcel",[requireExportExcel],getPermisionarioExcel)
router.get("/report",[requireExportPDF],getPermisoReport)


export default router;