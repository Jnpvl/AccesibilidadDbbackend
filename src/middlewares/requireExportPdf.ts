import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { UserDataSource } from "../config/database";
import { User } from "../entities/usuarios.entities";

export const requireExportPDF = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "No se proporcionó el token." });
      return;
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Formato de token inválido." });
      return;
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      res.status(401).json({ message: "Token no válido." });
      return;
    }
    
    const userId = decoded.payload.id;

    const userRepository = UserDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado." });
      return;
    }

    if (!user.canExportPdf) {
      res.status(403).json({ message: "No tienes permisos para exportar PDF" });
      return;
    }

    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error("Error en requireCreatePermission:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
