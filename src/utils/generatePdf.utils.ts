import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';

const generatePdf = async ({ template, data }: { template: string; data: any }) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const templatePath = path.resolve(__dirname, `../utils/Reports/${template}`);
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        const compiledTemplate = handlebars.compile(htmlContent);
        const compiledHtml = compiledTemplate(data);

        await page.setContent(compiledHtml, { waitUntil: 'networkidle2' });
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.resourceType() === 'image') {
                request.continue(); 
            } else {
                request.continue();
            }
        });


        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: false,

        });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        await browser.close();
        throw error;
    }
};

export const downloadReport = async (req: Request, res: Response, options: {
    tableName: string;
    columns?: string[];
    filters?: string;
    orderByColumn?: string;
    template: string;
    filename: string;
}): Promise<any> => {

    const queryRunner = AppDataSource.createQueryRunner();
    let query = `SELECT ${options.columns ? options.columns.join(", ") : "*"} FROM ${options.tableName}`;

    if (options.filters) {
        query += ` WHERE ${options.filters}`;
    }

    if (options.orderByColumn) {
        query += ` ORDER BY ${options.orderByColumn} ASC`;
    }

    try {
        await queryRunner.connect();
        const data: any[] = await queryRunner.query(query);

        const pdfBuffer = await generatePdf({ template: options.template, data: { registros: data } });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${options.filename}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    } catch (error) {
        console.error('Error generando el PDF:', error);
        res.status(500).send('Error generando el PDF');
    } finally {
        await queryRunner.release();
    }
};
