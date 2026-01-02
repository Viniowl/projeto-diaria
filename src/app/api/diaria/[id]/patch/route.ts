import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createDailylogSchema } from "@/app/_schemas-zod/diaria-schema";

const updateDailyLogSchema = createDailylogSchema.partial();

export async function PATCH(request: NextRequest, {params}: {params: {id: string}}){
    const token = request.cookies.get('auth_token')?.value;
    if (!token){
        return NextResponse.json({message: "Não autorizado"}, {status: 401});
    }

    const decodedToken = verifyToken(token);
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
        
        const { id } = params;

        const { count } = await prisma.dailyLog.updateMany({
            where: {
                id: id,
                userId: userId
            },
            data: validation.data
        });

        if (count === 0){
            return NextResponse.json(
                {message : "Diária não encontrada ou não pertence ao usuário"},
                {status: 404}
            );
        }

        const updateDailyLog = await prisma.dailyLog.findUnique({
            where: {id}
        })

        return NextResponse.json(updateDailyLog, {status: 200});
    } catch (error) {
        console.error("Erro ao atualizar diária:", error);
        return NextResponse.json(
            {message : "Ocorreu um erro no servidor"},
            {status : 500}
        )
        
    }
}
    
