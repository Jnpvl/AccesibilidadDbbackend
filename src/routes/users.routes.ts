import { Router } from "express";
import { createUser, getUsers, loginUser, updateUser } from "../controllers/user.controller";
import { requireCreatePermission } from "../middlewares/requireCreatePermission";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();

router.post("/login", loginUser);
router.post("/create", [requireCreatePermission],createUser);
router.get("/obtener",[verifyToken],getUsers)
router.put("/update/:id",[requireCreatePermission],updateUser)

export default router;