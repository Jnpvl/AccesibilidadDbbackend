import { Request, Response } from "express";
import { getPaginatedData } from "../utils/getPaginatedData.utils";
import { PaginationParams } from "../interfaces/shared.inferface";
import { Aseguradoras } from "../interfaces/aseguradoras.interface";

import { downloadReport } from "../utils/generatePdf.utils";
import { PermisosDataSource } from "../config/database";
import { downloadPersonaliteExcelReport } from "../utils/generateFilterExcel.utils";
import { generateExcel } from "../utils/generateExcel.utils";

export const getPermisos = async (req: Request, res: Response): Promise<void> => {
  const options: PaginationParams = {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    searchFields: ["TipoDePermiso", "Modalidad", "Sistema", "Permisionario", "Municipio", "Marca", "Modelo", "Capacidad", "TipoDeUnidad",]  
  };

  await getPaginatedData<Aseguradoras>(req, res, options, PermisosDataSource);
};

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


//personal
export const getPermisionarioData = async (req: Request, res: Response): Promise<void> => {
  const permisionarioId = Number(req.query.permisionarioId);

  if (isNaN(permisionarioId)) {
    res.status(400).json({ message: "permisionarioId inválido o no proporcionado" });
    return;
  }

  const queryRunner = PermisosDataSource.createQueryRunner();

  try {
    const queryPermisionario = `
      SELECT *
      FROM Permisionarios
      WHERE PermisionarioId = @0
    `;
    const permisionarioResult = await queryRunner.query(queryPermisionario, [permisionarioId]);
    const permisionario = permisionarioResult[0] || null; 

    const queryPermisos = `
      SELECT *
      FROM Permisos
      WHERE PermisionarioId = @0
      ORDER BY FechaTermino DESC
    `;
    const permisos = await queryRunner.query(queryPermisos, [permisionarioId]);

    res.status(200).json({
      permisionario,  
      permisos       
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos", error });
  } finally {
    await queryRunner.release();
  }
};

export const getPermisionarioExcel = async (req: Request, res: Response): Promise<void> => {
  let filtersObj: { [key: string]: string } | undefined = undefined;

  if (req.query.filters) {
    try {
      filtersObj = JSON.parse(req.query.filters as string);
    } catch (e) {
      console.error("Error parseando filters:", e);
    }
  }

  await generateExcel(req, res, {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    filters: filtersObj,
    filename: "reporte_permisos_join",
  }, PermisosDataSource);
};

export const getPermisosReport = async (req: Request, res: Response): Promise<void> => {
  const permisionarioId = Number(req.query.permisionarioId);

  let filterString = '';
  if (!isNaN(permisionarioId) && permisionarioId > 0) {
    filterString = `PermisionarioId = ${permisionarioId}`;
  }
  
  await downloadReport(req, res, {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    template: "permisos.html",
    filename: "reporte_permisos",
    filters: filterString
  }, PermisosDataSource);
};

export const getPermisoReport = async (req: Request, res: Response): Promise<void> => {
  const permisoId = Number(req.query.permisoId);

  let filterString = '';
  if (!isNaN(permisoId) && permisoId > 0) {
    filterString = `PermisoId = ${permisoId}`;
  }
  
  await downloadReport(req, res, {
    tableName: "Permisos",
    orderByColumn: "FechaTermino",
    template: "permiso.html", 
    filename: "reporte_permiso",
    filters: filterString
  }, PermisosDataSource);
};


