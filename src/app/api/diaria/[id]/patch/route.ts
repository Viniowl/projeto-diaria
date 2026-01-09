import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createDailylogSchema } from "@/app/_schemas-zod/diaria-schema";

const updateDailyLogSchema = createDailylogSchema.partial();

export async function PATCH(request: NextRequest, context: { params: { id: string } }){
    const token = request.cookies.get('auth_token')?.value;
    if (!token){
        return NextResponse.json({message: "Não autorizado"}, {status: 401});
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken){
        return NextResponse.json({ message: "Token inválido" }, { status: 401});
    }

    const {userId} = decodedToken;

    try {
        const body = await request.json();

        const validation = updateDailyLogSchema.safeParse(body);

        if(!validation.success){
            return NextResponse.json(
                {
                    message : "Dados Inválidos",
                    errors : validation.error.flatten().fieldErrors,
                }, 
                {status: 400}
            );
        }
        
        const { id } = context.params;

        const updatedDailyLog = await prisma.dailyLog.update({
            where: {
                id: id,
                userId: userId,
            },
            data: validation.data,
        });

        return NextResponse.json(updatedDailyLog, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { 
                message: "Ocorreu um erro ao atualizar a diária no servidor.",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
