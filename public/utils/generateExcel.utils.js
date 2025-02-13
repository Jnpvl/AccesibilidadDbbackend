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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const generateExcel = (req, res, options, dataSource) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = dataSource.createQueryRunner();
    let query = `SELECT * FROM ${options.tableName}`;
    if (options.filters && Object.keys(options.filters).length > 0) {
        let conditionsArr = [];
        if (options.filters.soloVigentes) {
            conditionsArr.push(`FechaTermino > GETDATE()`);
            delete options.filters.soloVigentes;
        }
        if (options.filters.hasOwnProperty('global')) {
            const globalTerm = options.filters['global'];
            const globalSearchColumns = [
                'PermisionarioId',
                'TipoDePermiso',
                'NoExpediente',
                'Modalidad',
                'Sistema',
                'Permisionario',
                'Municipio',
                'Terminos',
                'Marca',
                'Modelo',
                'TipoDeUnidad'
            ];
            const globalConditions = globalSearchColumns
                .map(col => `${col} LIKE '%${globalTerm}%'`)
                .join(" OR ");
            conditionsArr.push(`(${globalConditions})`);
            delete options.filters['global'];
        }
        for (const [col, value] of Object.entries(options.filters)) {
            if (value && value.trim() !== '') {
                if (col === 'PermisionarioId') {
                    // Asumiendo que PermisionarioId en la DB es un INT
                    conditionsArr.push(`${col} = ${value}`);
                }
                else {
                    conditionsArr.push(`${col} LIKE '%${value}%'`);
                }
            }
        }
        if (conditionsArr.length > 0) {
            query += ` WHERE ${conditionsArr.join(" AND ")}`;
        }
    }
    if (options.orderByColumn) {
        query += ` ORDER BY ${options.orderByColumn} DESC`;
    }
    try {
        yield queryRunner.connect();
        const data = yield queryRunner.query(query);
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');
        let worksheetColumns = [];
        if (data.length > 0) {
            worksheetColumns = Object.keys(data[0]).map(key => ({ header: key, key, width: 20 }));
        }
        worksheet.columns = worksheetColumns;
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        data.forEach(row => {
            worksheet.addRow(row);
        });
        const buffer = yield workbook.xlsx.writeBuffer();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${options.filename}.xlsx"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    catch (error) {
        console.error('Error generando el Excel:', error);
        res.status(500).send('Error generando el Excel');
    }
    finally {
        yield queryRunner.release();
    }
});
exports.generateExcel = generateExcel;
