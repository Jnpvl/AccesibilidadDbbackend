import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import ExcelJS from 'exceljs';

export const generateExcel= async (
  req: Request,
  res: Response,
  options: {
    tableName: string;
    filters?: { [key: string]: string };
    orderByColumn?: string;
    filename: string;
  },
  dataSource: DataSource
): Promise<any> => {
  const queryRunner = dataSource.createQueryRunner();

  let query = `SELECT * FROM ${options.tableName}` ;

  if (options.filters && Object.keys(options.filters).length > 0) {
    let conditionsArr: string[] = [];
    
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
        } else {
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
    await queryRunner.connect();
    const data: any[] = await queryRunner.query(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    let worksheetColumns: Partial<ExcelJS.Column>[] = [];
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
