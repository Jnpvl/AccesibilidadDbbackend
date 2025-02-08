import { Request, Response } from "express";
import { getPaginatedData } from "../utils/getPaginatedData.utils";
import { PaginationParams } from "../interfaces/shared.inferface";

import { downloadReport } from "../utils/generatePdf.utils";
import { downloadPersonaliteExcelReport } from "../utils/generateFilterExcel.utils";
import { ConcesionesDataSource } from "../config/database";
import { Permisos } from "../interfaces/Permisos.interface";

export const getConcesionarios = async (req: Request, res: Response): Promise<void> => {
  const options: PaginationParams = {
    tableName: "NuevasConcesiones",
    orderByColumn: "kCodigo",
    searchFields: ["kCodigo", "KTerminos", "kConcesionario"]  //agregar tabla donde se puede buscar informacion para el input search
  };

  await getPaginatedData<Permisos>(req, res, options, ConcesionesDataSource);
};

export const getConcesionarioReport = async (req: Request, res: Response): Promise<void> => {
  await downloadReport(req, res, {
    tableName: "NuevasConcesiones",
    orderByColumn: "kCodigo",
    template: "concesiones.html",
    filename: "reporte_concesiones",
  }, ConcesionesDataSource);
}

export const getConcesionarioExcel = async (req: Request, res: Response): Promise<void> => {
  let filtersObj: { [key: string]: string } | undefined = undefined;
  if (req.query.filters) {
    try {
      filtersObj = JSON.parse(req.query.filters as string);
    } catch (e) {
      console.error("Error parseando filters:", e);
    }
  }
  await downloadPersonaliteExcelReport(req, res, {
    tableName: "NuevasConcesiones",
    orderByColumn: "kCodigo",
    filters: filtersObj,
    filename: "reporte_concesiones",
  }, ConcesionesDataSource);
};