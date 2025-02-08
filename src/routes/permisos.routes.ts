import { Router } from "express";
import { getPermisionarioData, getPermisos, getPermisosExcel, getPermisosReport } from "../controllers/Permisos.controller";


const router = Router();

router.get("/", getPermisos);
router.get("/report", getPermisosReport);
router.get("/excel",getPermisosExcel)
router.get("/permisionario", getPermisionarioData);


export default router;