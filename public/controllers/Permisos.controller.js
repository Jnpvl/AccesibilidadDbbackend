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
exports.getPermisoReport = exports.getPermisosReport = exports.getPermisionarioExcel = exports.getPermisionarioData = exports.getPermisosExcel = exports.getPermisos = void 0;
const getPaginatedData_utils_1 = require("../utils/getPaginatedData.utils");
const generatePdf_utils_1 = require("../utils/generatePdf.utils");
const database_1 = require("../config/database");
const generateFilterExcel_utils_1 = require("../utils/generateFilterExcel.utils");
const generateExcel_utils_1 = require("../utils/generateExcel.utils");
const getPermisos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        tableName: "Permisos",
        orderByColumn: "FechaTermino",
        searchFields: ["TipoDePermiso", "Modalidad", "Sistema", "Permisionario", "Municipio", "Marca", "Modelo", "Capacidad", "TipoDeUnidad",]
    };
    yield (0, getPaginatedData_utils_1.getPaginatedData)(req, res, options, database_1.PermisosDataSource);
});
exports.getPermisos = getPermisos;
const getPermisosExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        tableName: "Permisos",
        orderByColumn: "FechaTermino",
        filters: filtersObj,
        filename: "reporte_permisos",
    }, database_1.PermisosDataSource);
});
exports.getPermisosExcel = getPermisosExcel;
//personal
const getPermisionarioData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permisionarioId = Number(req.query.permisionarioId);
    if (isNaN(permisionarioId)) {
        res.status(400).json({ message: "permisionarioId inválido o no proporcionado" });
        return;
    }
    const queryRunner = database_1.PermisosDataSource.createQueryRunner();
    try {
        const queryPermisionario = `
      SELECT *
      FROM Permisionarios
      WHERE PermisionarioId = @0
    `;
        const permisionarioResult = yield queryRunner.query(queryPermisionario, [permisionarioId]);
        const permisionario = permisionarioResult[0] || null;
        const queryPermisos = `
      SELECT *
      FROM Permisos
      WHERE PermisionarioId = @0
      ORDER BY FechaTermino DESC
    `;
        const permisos = yield queryRunner.query(queryPermisos, [permisionarioId]);
        res.status(200).json({
            permisionario,
            permisos
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los datos", error });
    }
    finally {
        yield queryRunner.release();
    }
});
exports.getPermisionarioData = getPermisionarioData;
const getPermisionarioExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filtersObj = undefined;
    if (req.query.filters) {
        try {
            filtersObj = JSON.parse(req.query.filters);
        }
        catch (e) {
            console.error("Error parseando filters:", e);
        }
    }
    yield (0, generateExcel_utils_1.generateExcel)(req, res, {
        tableName: "Permisos",
        orderByColumn: "FechaTermino",
        filters: filtersObj,
        filename: "reporte_permisos_join",
    }, database_1.PermisosDataSource);
});
exports.getPermisionarioExcel = getPermisionarioExcel;
const getPermisosReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permisionarioId = Number(req.query.permisionarioId);
    let filterString = '';
    if (!isNaN(permisionarioId) && permisionarioId > 0) {
        filterString = `PermisionarioId = ${permisionarioId}`;
    }
    yield (0, generatePdf_utils_1.downloadReport)(req, res, {
        tableName: "Permisos",
        orderByColumn: "FechaTermino",
        template: "permisos.html",
        filename: "reporte_permisos",
        filters: filterString
    }, database_1.PermisosDataSource);
});
exports.getPermisosReport = getPermisosReport;
const getPermisoReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permisoId = Number(req.query.permisoId);
    let filterString = '';
    if (!isNaN(permisoId) && permisoId > 0) {
        filterString = `PermisoId = ${permisoId}`;
    }
    yield (0, generatePdf_utils_1.downloadReport)(req, res, {
        tableName: "Permisos",
        orderByColumn: "FechaTermino",
        template: "permiso.html",
        filename: "reporte_permiso",
        filters: filterString
    }, database_1.PermisosDataSource);
});
exports.getPermisoReport = getPermisoReport;
