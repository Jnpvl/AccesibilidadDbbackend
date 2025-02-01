import { DataSource } from "typeorm"
import dotenv from "dotenv";

dotenv.config();

 export const AppDataSource = new DataSource({
     type: "mssql",
     host: process.env.DB_HOST || "database",
     port: Number(process.env.DB_PORT) || 1433,
     username: process.env.DB_USER || "",
     password: process.env.DB_PASSWORD || "",
     database: process.env.DB_NAME || "",
     //entities: [Enterprise,Users,UserDetails],
     synchronize: true,
     extra: {
         options: {
             encrypt: true,  
             trustServerCertificate: true, 
         },
     },
 })

export const UserDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_LOGIN_HOST || "database",
    port: Number(process.env.DB_LOGIN_PORT) || 1433,
    username: process.env.DB_LOGIN_USER || "",
    password: process.env.DB_LOGIN_PASSWORD || "",
    database: process.env.DB_LOGIN_NAME || "",
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});

export const ConcesionesDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_CONCESIONES_HOST || "database",
    port: Number(process.env.DB_CONCESIONES_PORT) || 1433,
    username: process.env.DB_CONCESIONES_USER || "",
    password: process.env.DB_CONCESIONES_PASSWORD || "",
    database: process.env.DB_CONCESIONES_NAME || "",
    //entities: [Enterprise,Users,UserDetails],
    synchronize: true,
    extra: {
        options: {
            encrypt: true,  
            trustServerCertificate: true, 
        },
    },
})

export const PermisosDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_PERMISOS_HOST || "database",
    port: Number(process.env.DB_PERMISOS_PORT) || 1433,
    username: process.env.DB_PERMISOS_USER || "",
    password: process.env.DB_PERMISOS_PASSWORD || "",
    database: process.env.DB_PERMISOS_NAME || "",
    //entities: [Enterprise,Users,UserDetails],
    synchronize: true,
    extra: {
        options: {
            encrypt: true,  
            trustServerCertificate: true, 
        },
    },
})

export const initializeDatabases = async () => {
    try {
        await UserDataSource.initialize();
        console.log(" Conectado a la base de datos de usuarios");

        await ConcesionesDataSource.initialize();
        console.log(" Conectado a la base de datos de concesiones");

        await PermisosDataSource.initialize();
        console.log(" Conectado a la base de datos de permisos");
    } catch (error) {
        console.error("Error conectando a las bases de datos:", error);
    }
};

