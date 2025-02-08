import { Request, Response } from "express";
import { getPaginatedData } from "../utils/getPaginatedData.utils";
import { PaginationParams } from "../interfaces/shared.inferface";
import { Aseguradoras } from "../interfaces/aseguradoras.interface";

import { downloadReport } from "../utils/generatePdf.utils";
import { PermisosDataSource } from "../config/database";
import { downloadPersonaliteExcelReport } from "../utils/generateFilterExcel.utils";

export const getPermisos = async (req: Request, res: Response): Promise<void> => {
  const options: PaginationParams = {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    searchFields: ["TipoDePermiso", "Modalidad", "Sistema", "Permisionario", "Municipio", "Marca", "Modelo", "Capacidad", "TipoDeUnidad",]  
  };

  await getPaginatedData<Aseguradoras>(req, res, options, PermisosDataSource);
};

export const getPermisosReport = async (req: Request, res: Response): Promise<void> => {
  await downloadReport(req, res, {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    template: "permisos.html",
    filename: "reporte_permisos",
  }, PermisosDataSource);
}

export const getPermisosExcel = async (req: Request, res: Response): Promise<void> => {
  let filtersObj: { [key: string]: string } | undefined = undefined;
  if (req.query.filters) {
    try {
      filtersObj = JSON.parse(req.query.filters as string);
    } catch (e) {
      console.error("Error parseando filters:", e);
    }
  }
  await downloadPersonaliteExcelReport(req, res, {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    filters: filtersObj,
    filename: "reporte_permisos",
  }, PermisosDataSource);
};

export const getPermisionarioData = async (req: Request, res: Response): Promise<void> => {
  const permisionarioId = Number(req.query.permisionarioId);

  if (isNaN(permisionarioId)) {
    res.status(400).json({ message: "permisionarioId inválido o no proporcionado" });
    return;
  }

  const queryRunner = PermisosDataSource.createQueryRunner();

  try {
    const query = `
    SELECT *
    FROM Permisos
    WHERE PermisionarioId = @0
    ORDER BY FechaTermino DESC
  `;
    const data = await queryRunner.query(query, [permisionarioId]);

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos", error });
  } finally {
    await queryRunner.release();
  }
};

export const getPermisionarioGlobalReport = async (req: Request, res: Response): Promise<void> => {
  
}

