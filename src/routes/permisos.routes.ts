import { Router } from "express";
import { getPermisionarioData, getPermisionarioExcel, getPermisoReport, getPermisos, getPermisosExcel, getPermisosReport } from "../controllers/Permisos.controller";


const router = Router();

router.get("/", getPermisos);
router.get("/reports", getPermisosReport);
router.get("/excel",getPermisosExcel)
router.get("/permisionario", getPermisionarioData);
router.get("/permisionarioExcel",getPermisionarioExcel)
router.get("/report",getPermisoReport)


export default router;