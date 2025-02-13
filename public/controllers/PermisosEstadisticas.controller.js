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
exports.getStatisticsMunicipios = exports.getStatisticsPermisos = void 0;
const database_1 = require("../config/database");
const getStatisticsPermisos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const queryRunner = database_1.PermisosDataSource.createQueryRunner();
    try {
        const queries = {
            particular: `SELECT COUNT(*) AS Total FROM Permisos WHERE TipoDePermiso = 'Particular';`,
            eventual: `SELECT COUNT(*) AS Total FROM Permisos WHERE TipoDePermiso = 'Eventual';`,
            modalidadCarga: `SELECT COUNT(*) AS Total FROM Permisos WHERE Modalidad = 'Carga';`,
            modalidadPasaje: `SELECT COUNT(*) AS Total FROM Permisos WHERE Modalidad = 'Pasaje';`,
        };
        const results = yield Promise.all(Object.values(queries).map(query => queryRunner.query(query)));
        const statistics = {
            particular: ((_a = results[0][0]) === null || _a === void 0 ? void 0 : _a.Total) || 0,
            eventual: ((_b = results[1][0]) === null || _b === void 0 ? void 0 : _b.Total) || 0,
            modalidadCarga: ((_c = results[2][0]) === null || _c === void 0 ? void 0 : _c.Total) || 0,
            modalidadPasaje: ((_d = results[3][0]) === null || _d === void 0 ? void 0 : _d.Total) || 0,
        };
        res.status(200).json(statistics);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los datos", error });
    }
    finally {
        yield queryRunner.release();
    }
});
exports.getStatisticsPermisos = getStatisticsPermisos;
const getStatisticsMunicipios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queryRunner = database_1.PermisosDataSource.createQueryRunner();
    const municipios = [
        "Aconchi",
        "Agua Prieta",
        "Alamos",
        "Altar",
        "Arivechi",
        "Arizpe",
        "Atil",
        "Bacadehuachi",
        "Bacanora",
        "Bacerac",
        "Bacoachi",
        "Bacum",
        "Banamichi",
        "Baviacora",
        "Bavispe",
        "Benjamin Hill",
        "Caborca",
        "Cajeme",
        "Cananea",
        "Carbo",
        "La Colorada",
        "Cucurpe",
        "Cumpas",
        "Divisaderos",
        "Empalme",
        "Etchojoa",
        "Fronteras",
        "Granados",
        "Guaymas",
        "Hermosillo",
        "Huachinera",
        "Huasabas",
        "Huatabampo",
        "Huepac",
        "Imuris",
        "Magdalena",
        "Mazatan",
        "Moctezuma",
        "Naco",
        "Nacori Chico",
        "Nacozari de Garcia",
        "Navojoa",
        "Nogales",
        "Obregon",
        "Onavas",
        "Opodepe",
        "Oquitoa",
        "Pitiquito",
        "Puerto Peñasco",
        "Quiriego",
        "Rayon",
        "Rosario",
        "Sahuaripa",
        "San Felipe de Jesus",
        "San Javier",
        "San Luis Río Colorado",
        "San Miguel de Horcasitas",
        "San Pedro de la Cueva",
        "Santa Ana",
        "Santa Cruz",
        "Saric",
        "Soyopa",
        "Suaqui Grande",
        "Tepache",
        "Trincheras",
        "Tubutama",
        "Ures",
        "Villa Hidalgo",
        "Villa Pesqueira",
        "Yecora",
        "General Plutarco Elías Calles",
        "Benito Juarez",
        "San Ignacio Rio Muerto",
    ];
    try {
        const totalQuery = `SELECT COUNT(*) AS Total FROM Permisos;`;
        const totalResult = yield queryRunner.query(totalQuery);
        const totalRecords = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.Total) || 0;
        const queries = municipios.reduce((acc, municipio) => {
            const key = municipio
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "");
            acc[key] = `SELECT COUNT(*) AS Total FROM Permisos WHERE municipio LIKE '%${municipio.toLowerCase()}%';`;
            return acc;
        }, {});
        const resultsArray = yield Promise.all(Object.values(queries).map((query) => queryRunner.query(query)));
        const statistics = Object.keys(queries).reduce((acc, key, index) => {
            var _a;
            acc[key] = ((_a = resultsArray[index][0]) === null || _a === void 0 ? void 0 : _a.Total) || 0;
            return acc;
        }, {});
        const sumMunicipal = Object.values(statistics).reduce((sum, current) => sum + current, 0);
        statistics["indefinidos"] = totalRecords - sumMunicipal;
        res.status(200).json(statistics);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los datos", error });
    }
    finally {
        yield queryRunner.release();
    }
});
exports.getStatisticsMunicipios = getStatisticsMunicipios;
// Tipo de Permiso
// Cantidad de permisos "Particular"
// Cantidad de permisos "Eventual" (suponiendo que existan registros con ese valor)
// Términos
// Cantidad de registros para cada valor del campo "Terminos"
// Marca
// Conteo de registros agrupados por "Marca"
// Modelo
// Conteo de registros agrupados por "Modelo"
// Tipo de Unidad
// Conteo por "TipoDeUnidad"
// Municipio
// Cantidad de registros agrupados por "Municipio"
// Estado (Vencidos vs. Activos)
// Vencidos: Registros cuya "FechaTermino" es anterior a la fecha actual
// Activos: Registros cuya "FechaTermino" es igual o posterior a la fecha actual
