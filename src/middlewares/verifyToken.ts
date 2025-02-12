import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";

export const verifyToken = async (
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

    (req as any).user = decoded.payload; 

    next();
  } catch (error) {
    console.error("Error en verifyToken:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
