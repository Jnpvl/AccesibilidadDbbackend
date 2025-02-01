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
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const offset = (page - 1) * pageSize;

  const search = req.query.search as string || '';
  const searchFields = params.searchFields || [];

  try {
    let whereClause = '';
    if (search && searchFields.length > 0) {
      whereClause = `WHERE ${searchFields
        .map((field) => `LOWER(${field}) LIKE '%${search.toLowerCase()}%'`)
        .join(" OR ")}`;
    }

    const query = `
      SELECT * FROM ${params.tableName} 
      ${whereClause}
      ORDER BY ${params.orderByColumn}
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
