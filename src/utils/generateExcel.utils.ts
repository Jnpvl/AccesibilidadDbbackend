import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import ExcelJS from 'exceljs';

//funciona para exportar las columnas que se quieren, no filtrar por datos especificos

export const downloadExcelReport = async (
    req: Request,
    res: Response,
    options: {
      tableName: string;
      columns?: string[];
      filters?: string;
      orderByColumn?: string;
      filename: string;
    },
    dataSource: DataSource
  ): Promise<any> => {
    const queryRunner = dataSource.createQueryRunner();
  
    let query = `SELECT ${options.columns ? options.columns.join(", ") : "*"} FROM ${options.tableName}`;
    
    if (options.filters) {
      if (options.columns && options.columns.length > 0) {
        const searchTerm = options.filters; 
        const conditions = options.columns
          .map(col => `${col} LIKE '%${searchTerm}%'`)
          .join(" OR ");
        query += ` WHERE (${conditions})`;
      } else {
     
        query += ` WHERE ${options.filters}`;
      }
    }
  
    if (options.orderByColumn) {
      query += ` ORDER BY ${options.orderByColumn} ASC`;
    }
  
    try {
      await queryRunner.connect();
      const data: any[] = await queryRunner.query(query);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte');
  
      let worksheetColumns: Partial<ExcelJS.Column>[] | { header: string; key: string; width: number; }[];
      if (options.columns && options.columns.length > 0) {
        worksheetColumns = options.columns.map(col => ({ header: col, key: col, width: 20 }));
      } else if (data.length > 0) {
        worksheetColumns = Object.keys(data[0]).map(key => ({ header: key, key, width: 20 }));
      } else {
        worksheetColumns = [];
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
  
      const buffer = await workbook.xlsx.writeBuffer() as Buffer;
  
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${options.filename}.xlsx"`,
        'Content-Length': buffer.length,
      });
  
      res.end(buffer);
    } catch (error) {
      console.error('Error generando el Excel:', error);
      res.status(500).send('Error generando el Excel');
    } finally {
      await queryRunner.release();
    }
  };
  