import { Router } from "express";
import { getAseguradoras,getAseguradorasReport} from "../controllers/aseguradoras.controller";


const router = Router();

router.get("/", getAseguradoras);
router.get("/report", getAseguradorasReport);
//router.get("/excel",getAseguradorasExcel)

export default router;