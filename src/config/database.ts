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