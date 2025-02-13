"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedData = void 0;
const getPaginatedData = (req, res, params, dataSource) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = dataSource.createQueryRunner();
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;
    const offset = (page - 1) * pageSize;
    const search = req.query.search || "";
    const searchFields = params.searchFields || [];
    const fechaInicio = req.query.fechaInicio;
    const fechaTermino = req.query.fechaTermino;
    try {
        let whereConditions = [];
        if (search && searchFields.length > 0) {
            whereConditions.push(`(${searchFields
                .map((field) => `LOWER(${field}) LIKE '%${search.toLowerCase()}%'`)
                .join(" OR ")})`);
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
        const data = yield queryRunner.query(query);
        const countQuery = `
      SELECT COUNT(*) as total FROM ${params.tableName} ${whereClause}
    `;
        const totalCount = yield queryRunner.query(countQuery);
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los datos", error });
    }
    finally {
        yield queryRunner.release();
    }
});
exports.getPaginatedData = getPaginatedData;
