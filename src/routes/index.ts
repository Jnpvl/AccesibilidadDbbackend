import { Router } from "express";
import UserRoutes  from "./aseguradoras.routes"


const v1Router = Router();

v1Router.use("/aseguradoras",UserRoutes);


export default v1Router;