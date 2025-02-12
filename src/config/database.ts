import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/usuarios.entities";
import bcrypt from "bcryptjs"; 

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST || "database",
    port: Number(process.env.DB_PORT) || 1433,
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});

export const UserDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_LOGIN_HOST || "database",
    port: Number(process.env.DB_LOGIN_PORT) || 1433,
    username: process.env.DB_LOGIN_USER || "",
    password: process.env.DB_LOGIN_PASSWORD || "",
    database: process.env.DB_LOGIN_NAME || "",
    entities: [User],
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
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});

export const PermisosDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_PERMISOS_HOST || "database",
    port: Number(process.env.DB_PERMISOS_PORT) || 1433,
    username: process.env.DB_PERMISOS_USER || "",
    password: process.env.DB_PERMISOS_PASSWORD || "",
    database: process.env.DB_PERMISOS_NAME || "",
    synchronize: true,
    extra: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});

export const seedAdminUser = async (): Promise<void> => {
    try {
        const userRepository = UserDataSource.getRepository(User);

        const adminExists = await userRepository.findOne({ where: { role: 'administrador' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("Se20sepaad80$", 10);  // Funciona con bcryptjs ✅

            const adminUser = userRepository.create({
                role: 'administrador',
                Name: 'Administrador',
                ApellidoM: 'Administrador',
                ApellidoP: 'Administrador',
                username: 'admin',
                password: hashedPassword,
                status: 'Activo',
                canExportExcel: true,
                canExportPdf: true,
                canCreateUser: true,
            });

            await userRepository.save(adminUser);
            console.log("Usuario administrador creado exitosamente.");
        } else {
            console.log("El usuario administrador ya existe.");
        }
    } catch (error) {
        console.error("Error en el seeding del usuario administrador:", error);
    }
};

export const initializeDatabases = async () => {
    try {
        await UserDataSource.initialize();
        console.log("Conectado a la base de datos de usuarios");

        await seedAdminUser();

        await ConcesionesDataSource.initialize();
        console.log("Conectado a la base de datos de concesiones");

        await PermisosDataSource.initialize();
        console.log("Conectado a la base de datos de permisos");
    } catch (error) {
        console.error("Error conectando a las bases de datos:", error);
    }
};
