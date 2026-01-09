import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/app/_schemas-zod/auth-schemas";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message : "Dados inválidos", errors: validation.error.flatten().fieldErrors},
                { status: 400 }
            );
        }

        const { password, token } = validation.data;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "Token inválido ou expirado" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordChangedAt: new Date(),
                passwordResetToken: null,
                passwordResetExpires: null
            }
        });

        return NextResponse.json(
            { message: "Senha redefinida com sucesso!"},
            { status: 200 }
        );
    } catch (error) {
        console.error(" Erro na Api de redefinição de senha", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}