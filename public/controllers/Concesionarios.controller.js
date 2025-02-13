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
exports.getConcesionarioExcel = exports.getConcesionarioReport = exports.getConcesionarios = void 0;
const getPaginatedData_utils_1 = require("../utils/getPaginatedData.utils");
const generatePdf_utils_1 = require("../utils/generatePdf.utils");
const generateFilterExcel_utils_1 = require("../utils/generateFilterExcel.utils");
const database_1 = require("../config/database");
const getConcesionarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        tableName: "NuevasConcesiones",
        orderByColumn: "kCodigo",
        searchFields: ["kCodigo", "KTerminos", "kConcesionario"] //agregar tabla donde se puede buscar informacion para el input search
    };
    yield (0, getPaginatedData_utils_1.getPaginatedData)(req, res, options, database_1.ConcesionesDataSource);
});
exports.getConcesionarios = getConcesionarios;
const getConcesionarioReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, generatePdf_utils_1.downloadReport)(req, res, {
        tableName: "NuevasConcesiones",
        orderByColumn: "kCodigo",
        template: "concesiones.html",
        filename: "reporte_concesiones",
    }, database_1.ConcesionesDataSource);
});
exports.getConcesionarioReport = getConcesionarioReport;
const getConcesionarioExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filtersObj = undefined;
    if (req.query.filters) {
        try {
            filtersObj = JSON.parse(req.query.filters);
        }
        catch (e) {
            console.error("Error parseando filters:", e);
        }
    }
    yield (0, generateFilterExcel_utils_1.downloadPersonaliteExcelReport)(req, res, {
        tableName: "NuevasConcesiones",
        orderByColumn: "kCodigo",
        filters: filtersObj,
        filename: "reporte_concesiones",
    }, database_1.ConcesionesDataSource);
});
exports.getConcesionarioExcel = getConcesionarioExcel;
