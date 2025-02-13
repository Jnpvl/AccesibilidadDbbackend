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
exports.getAseguradorasReport = exports.getAseguradoras = void 0;
const getPaginatedData_utils_1 = require("../utils/getPaginatedData.utils");
const generatePdf_utils_1 = require("../utils/generatePdf.utils");
const database_1 = require("../config/database");
const getAseguradoras = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        tableName: "Aseguradoras",
        orderByColumn: "seg_id",
        searchFields: ["seg_nombre"]
    };
    yield (0, getPaginatedData_utils_1.getPaginatedData)(req, res, options, database_1.ConcesionesDataSource);
});
exports.getAseguradoras = getAseguradoras;
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
const getAseguradorasReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, generatePdf_utils_1.downloadReport)(req, res, {
        tableName: "Aseguradoras",
        orderByColumn: "seg_id",
        template: "aseguradora.html",
        filename: "reporte_aseguradoras",
    }, database_1.ConcesionesDataSource);
});
exports.getAseguradorasReport = getAseguradorasReport;
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
