import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";


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
export async function verifyToken(token: string): Promise<{ userId: string} | null> {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; iat: number };
        
        const user = await prisma.user.findUnique({
            where: {id: payload.userId},
            select: { passwordChangedAt: true }
        });

        if (!user) {
            return null;
        }

        if (user.passwordChangedAt) {
            const passwordChangedAtTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
            
            if (passwordChangedAtTimestamp > payload.iat) {
                return null;
            }
        }

        return { userId: payload.userId};
        
    } catch {
        return null;
    }
}