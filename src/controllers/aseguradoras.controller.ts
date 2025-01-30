import { Request, Response } from "express";
import { getPaginatedData } from "../utils/getPaginatedData.utils";
import { PaginationParams } from "../interfaces/shared.inferface";
import { Aseguradoras } from "../interfaces/aseguradoras.interface";
import { downloadReport } from "../utils/generatePdf.utils";



export const getAseguradoras = async (req: Request, res: Response): Promise<void> => {
  const options: PaginationParams = {
    tableName: "Aseguradoras",
    orderByColumn: "seg_id",
    searchFields: ["seg_nombre"]
  };

  await getPaginatedData<Aseguradoras>(req, res, options);
};

//   //filtrar contenido
//  // await downloadReport(req, res, {
//  //   tableName: "Aseguradoras",
//  //   orderByColumn: "seg_id",
//  //   columns: ["seg_id", "seg_nombre"],
//  //   filters: "activo = 1", 
//  //   template: "aseguradora.handlebars",
//  //   filename: "reporte_clientes"
//  // });
// };

export const getAseguradorasReport = async (req: Request, res: Response): Promise<void> => {
  await downloadReport(req, res, {
         tableName: "Aseguradoras",
         orderByColumn: "seg_id",
         template: "aseguradora.html",
         filename: "reporte_aseguradoras",
     });
}

