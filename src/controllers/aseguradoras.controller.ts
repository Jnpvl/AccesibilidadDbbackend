import { Request, Response } from "express";
import { getPaginatedData } from "../utils/getPaginatedData.utils";
import { PaginationParams } from "../interfaces/shared.inferface";
import { Aseguradoras } from "../interfaces/aseguradoras.interface";

import { downloadReport } from "../utils/generatePdf.utils";
import { ConcesionesDataSource } from "../config/database";

export const getAseguradoras = async (req: Request, res: Response): Promise<void> => {
  const options: PaginationParams = {
    tableName: "Aseguradoras",
    orderByColumn: "seg_id",
    searchFields: ["seg_nombre"]
  };

  await getPaginatedData<Aseguradoras>(req, res, options, ConcesionesDataSource);
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
  }, ConcesionesDataSource);
}

// export const getAseguradorasExcel = async (req: Request, res: Response): Promise<void> => {
  
//   const columnsParam = req.query.columns as string | undefined;
//   const filters = req.query.filters as string | undefined;

//   const columns: string[] | undefined = columnsParam ? columnsParam.split(',') : undefined;

//   await downloadExcelReport(req, res, {
//     tableName: "Aseguradoras",
//     orderByColumn: "seg_id",
//     columns, 
//     filters, 
//     filename: "reporte_aseguradoras",
//   }, ConcesionesDataSource);
// };