import { PermisosDataSource } from "../config/database";
import { Request, Response } from "express";

export const getStatisticsPermisos = async (req: Request, res: Response): Promise<void> => {
    const queryRunner = PermisosDataSource.createQueryRunner();

    try {
        const queries = {
            particular: `SELECT COUNT(*) AS Total FROM Permisos WHERE TipoDePermiso = 'Particular';`,
            eventual: `SELECT COUNT(*) AS Total FROM Permisos WHERE TipoDePermiso = 'Eventual';`,
            modalidadCarga: `SELECT COUNT(*) AS Total FROM Permisos WHERE Modalidad = 'Carga';`,
            modalidadPasaje: `SELECT COUNT(*) AS Total FROM Permisos WHERE Modalidad = 'Pasaje';`,
        };

        const results = await Promise.all(
            Object.values(queries).map(query => queryRunner.query(query))
        );

        const statistics = {
            particular: results[0][0]?.Total || 0,
            eventual: results[1][0]?.Total || 0,
            modalidadCarga: results[2][0]?.Total || 0,
            modalidadPasaje: results[3][0]?.Total || 0,
        };

        res.status(200).json(statistics);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los datos", error });
    } finally {
        await queryRunner.release();
    }
};

export const getStatisticsMunicipios = async (req: Request, res: Response): Promise<void> => {
  const queryRunner = PermisosDataSource.createQueryRunner();

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
    const totalResult = await queryRunner.query(totalQuery);
    const totalRecords = totalResult[0]?.Total || 0;

    const queries = municipios.reduce((acc, municipio) => {
      const key = municipio
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
      acc[key] = `SELECT COUNT(*) AS Total FROM Permisos WHERE municipio LIKE '%${municipio.toLowerCase()}%';`;
      return acc;
    }, {} as Record<string, string>);

    const resultsArray = await Promise.all(
      Object.values(queries).map((query) => queryRunner.query(query))
    );

    const statistics = Object.keys(queries).reduce((acc, key, index) => {
      acc[key] = resultsArray[index][0]?.Total || 0;
      return acc;
    }, {} as Record<string, number>);

    const sumMunicipal = Object.values(statistics).reduce((sum, current) => sum + current, 0);

    statistics["indefinidos"] = totalRecords - sumMunicipal;

    res.status(200).json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos", error });
  } finally {
    await queryRunner.release();
  }

};




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