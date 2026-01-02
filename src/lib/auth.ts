import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error('A variável de ambiente JWT_SECRET não está definida. Por favor, adicione-a ao seu arquivo .env');
}
const JWT_SECRET = process.env.JWT_SECRET;

// Hashear senha
export async function hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password,10);
}

// Verificar senha
export async function verifyPassword(password:string, hashedPassword:string): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
}

// Criar token JWT
export function createToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {expiresIn: '1d'}); 
}

// Verificar e decodificar token
export function verifyToken(token: string): { userId: string} | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}