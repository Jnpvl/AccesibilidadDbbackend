import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { PaginationParams } from "../interfaces/shared.inferface";

export const getPaginatedData = async <T>(
  req: Request,
  res: Response,
  params: PaginationParams,
  dataSource: DataSource
): Promise<Response> => {
  const queryRunner = dataSource.createQueryRunner();

  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 9;
  const offset = (page - 1) * pageSize;

  const search = (req.query.search as string) || "";
  const searchFields = params.searchFields || [];

  const fechaInicio = req.query.fechaInicio as string; 
  const fechaTermino = req.query.fechaTermino as string; 

  try {
    let whereConditions: string[] = [];

    if (search && searchFields.length > 0) {
      whereConditions.push(
        `(${searchFields
          .map((field) => `LOWER(${field}) LIKE '%${search.toLowerCase()}%'`)
          .join(" OR ")})`
      );
    }

    if (fechaInicio && fechaTermino) {
      whereConditions.push(`FechaInicio >= '${fechaInicio}' AND FechaTermino <= '${fechaTermino}'`);
    }

    let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const query = `
      SELECT * FROM ${params.tableName} 
      ${whereClause}
      ORDER BY ${params.orderByColumn} DESC
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `;

    const data: T[] = await queryRunner.query(query);

    const countQuery = `
      SELECT COUNT(*) as total FROM ${params.tableName} ${whereClause}
    `;
    const totalCount = await queryRunner.query(countQuery);
    const totalRecords = totalCount[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return res.status(200).json({
      data,
      pagination: {
        page,
        pageSize,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los datos", error });
  } finally {
    await queryRunner.release();
  }
};
