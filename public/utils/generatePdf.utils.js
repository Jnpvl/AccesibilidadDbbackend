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
exports.downloadReport = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const IMG_BACKGROUND = process.env.IMG_BACKGROUND || 'http://localhost:8080/assets/background.png';
console.log(IMG_BACKGROUND);
const paginateData = (data, pageSize) => {
    const paginated = [];
    for (let i = 0; i < data.length; i += pageSize) {
        paginated.push({
            pageNumber: paginated.length + 1,
            registros: data.slice(i, i + pageSize)
        });
    }
    return paginated;
};
const generatePdf = (_a) => __awaiter(void 0, [_a], void 0, function* ({ template, data }) {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    try {
        const templatePath = path_1.default.resolve(__dirname, `../utils/Reports/${template}`);
        let htmlContent = fs_1.default.readFileSync(templatePath, 'utf8');
        const paginatedData = paginateData(data.registros, 1);
        const compiledTemplate = handlebars_1.default.compile(htmlContent);
        const compiledHtml = compiledTemplate({
            paginatedRegistros: paginatedData,
            imgBackground: IMG_BACKGROUND
        });
        yield page.setContent(compiledHtml, { waitUntil: 'networkidle2' });
        yield page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue();
        });
        const pdfBuffer = yield page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: false,
        });
        yield browser.close();
        return pdfBuffer;
    }
    catch (error) {
        console.error("Error al generar el PDF:", error);
        yield browser.close();
        throw error;
    }
});
const downloadReport = (req, res, options, dataSource) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = dataSource.createQueryRunner();
    let query = `SELECT ${options.columns ? options.columns.join(", ") : "*"} FROM ${options.tableName}`;
    if (options.filters) {
        query += ` WHERE ${options.filters}`;
    }
    if (options.orderByColumn) {
        query += ` ORDER BY ${options.orderByColumn} DESC`;
    }
    try {
        yield queryRunner.connect();
        const data = yield queryRunner.query(query);
        const pdfBuffer = yield generatePdf({
            template: options.template,
            data: { registros: data }
        });
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${options.filename}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });
        res.end(pdfBuffer);
    }
    catch (error) {
        console.error('Error generando el PDF:', error);
        res.status(500).send('Error generando el PDF');
    }
    finally {
        yield queryRunner.release();
    }
});
exports.downloadReport = downloadReport;
