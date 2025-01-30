import jwt from "jsonwebtoken";
import { token } from "morgan";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const generateJWT = (payload: any) => {
    const token = jwt.sign({ payload }, JWT_SECRET, {
        expiresIn: 7 * 86400
    });
    return token;
}

export const verifyJWT = (token: string): any => {
    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        return decoded;
    }catch (error){
        console.error("error verificando jwt:",error);
        return null;
    }
}