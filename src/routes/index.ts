import { Router } from "express";
import exampleRoute  from "./aseguradoras.routes"


import concesionariosRoute from "./concesionarios.routes"
import permisosRoute from "./permisos.routes"
import usersRoute from "./users.routes"
import permisosStats from "./permisos.Estadisticas.routes"



const v1Router = Router();

v1Router.use("/aseguradoras",exampleRoute);
v1Router.use("/concesionarios",concesionariosRoute);
v1Router.use("/permisos",permisosRoute);
v1Router.use("/users",usersRoute);
v1Router.use("/permisosStats",permisosStats)





export default v1Router;