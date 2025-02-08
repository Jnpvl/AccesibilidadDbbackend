import { Router } from "express";
import exampleRoute  from "./aseguradoras.routes"


import concesionariosRoute from "./concesionarios.routes"
import permisosRoute from "./permisos.routes"



const v1Router = Router();

v1Router.use("/aseguradoras",exampleRoute);
v1Router.use("/concesionarios",concesionariosRoute);
v1Router.use("/permisos",permisosRoute);




export default v1Router;