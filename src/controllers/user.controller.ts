import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/usuarios.entities";
import { UserDataSource } from "../config/database";
import { generateJWT } from "../utils/jwt.utils";
import { PaginationParams } from "../interfaces/shared.inferface";
import { getPaginatedData } from "../utils/getPaginatedData.utils";
import { Usuarios } from "../interfaces/usuarios.interface";


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Se requieren usuario y contraseña." });
      return;
    }

    const userRepository = UserDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado." });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Contraseña incorrecta." });
      return;
    }

    if (user.status !== "Activo") {
      res.status(403).json({ message: "Usuario inactivo. Contacte al administrador." });
      return;
    }

    const token = generateJWT({ id: user.id, username: user.username, role: user.role });
    res.status(200).json({ message: "Inicio de sesión exitoso.", user, token });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, Name, ApellidoP, ApellidoM, password, canExportExcel, canExportPdf, canCreateUser } = req.body;

    if (!role || !Name || !ApellidoP || !password) {
      res.status(400).json({ message: "Faltan datos obligatorios: role, Name, ApellidoP y password." });
      return;
    }

    const baseUsername = (Name[0] + ApellidoP).toLowerCase();
    let uniqueUsername = baseUsername;
    let counter = 0;

    const userRepository = UserDataSource.getRepository(User);

    while (await userRepository.findOne({ where: { username: uniqueUsername } })) {
      counter++;
      uniqueUsername = baseUsername + counter;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      role,
      Name,
      ApellidoP,
      ApellidoM: ApellidoM || "",
      username: uniqueUsername,
      password: hashedPassword,
      status: "Activo",
      canExportExcel: canExportExcel || false,
      canExportPdf: canExportPdf || false,
      canCreateUser: canCreateUser !== undefined ? canCreateUser : true,
    });

    await userRepository.save(newUser);
    res.status(201).json({ message: "Usuario creado exitosamente.", user: newUser });
  } catch (error) {
    console.error("Error en createUser:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const { role, Name, ApellidoP, ApellidoM, password, status, canExportExcel, canExportPdf, canCreateUser } = req.body;

    const userRepository = UserDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado." });
      return;
    }

    if (role) user.role = role;
    if (Name) user.Name = Name;
    if (ApellidoP) user.ApellidoP = ApellidoP;
    if (ApellidoM !== undefined) user.ApellidoM = ApellidoM;
    if (status) user.status = status;
    if (canExportExcel !== undefined) user.canExportExcel = canExportExcel;
    if (canExportPdf !== undefined) user.canExportPdf = canExportPdf;
    if (canCreateUser !== undefined) user.canCreateUser = canCreateUser;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (Name || ApellidoP) {
      const newUsername = ((Name || user.Name)[0] + (ApellidoP || user.ApellidoP)).toLowerCase();
      user.username = newUsername;
    }

    await userRepository.save(user);
    res.status(200).json({ message: "Usuario actualizado correctamente.", user });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const options: PaginationParams = {
    tableName: "usuarios",
    orderByColumn: "id",
    searchFields: ["role","Name","ApellidoP","ApellidoM","username"]
  };

  await getPaginatedData<Usuarios>(req, res, options, UserDataSource);
}
