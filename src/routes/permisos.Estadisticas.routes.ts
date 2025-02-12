import { Router } from "express";
import { getStatisticsMunicipios, getStatisticsPermisos } from "../controllers/PermisosEstadisticas.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.get("/general",[verifyToken],getStatisticsPermisos);
router.get("/municipios",[verifyToken],getStatisticsMunicipios);


export default router;