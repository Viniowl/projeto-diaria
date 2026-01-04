import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createDailylogSchema } from "@/app/_schemas-zod/diaria-schema";

const updateDailyLogSchema = createDailylogSchema.partial();

export async function PATCH(request: NextRequest, context: {params: {id: string}}){
    console.log("PATCH /api/diaria/[id]/patch: Iniciando requisição"); // Log 1
    const token = request.cookies.get('auth_token')?.value;
    if (!token){
        console.log("PATCH /api/diaria/[id]/patch: Token não encontrado, retornando 401."); // Log 2
        return NextResponse.json({message: "Não autorizado"}, {status: 401});
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken){
        console.log("PATCH /api/diaria/[id]/patch: Token inválido, retornando 401."); // Log 3
        return NextResponse.json({ message: "Token inválido" }, { status: 401});
    }

    const {userId} = decodedToken;
    console.log("PATCH /api/diaria/[id]/patch: Usuário autenticado:", userId); // Log 4

    try {
        const body = await request.json();
        console.log("PATCH /api/diaria/[id]/patch: Corpo da requisição recebido:", body); // Log 5

        const validation = updateDailyLogSchema.safeParse(body);

        if(!validation.success){
            console.log("PATCH /api/diaria/[id]/patch: Validação falhou, retornando 400. Erros:", validation.error.flatten().fieldErrors); // Log 6
            return NextResponse.json(
                {
                    message : "Dados Inválidos",
                    errors : validation.error.flatten().fieldErrors,
                }, 
                {status: 400}
            );
        }
        
        const { id } = context.params;
        console.log("PATCH /api/diaria/[id]/patch: Tentando atualizar diária com ID:", id); // Log 7

        const updatedDailyLog = await prisma.dailyLog.update({
            where: {
                id: id,
                userId: userId,
            },
            data: validation.data,
        });

        console.log("PATCH /api/diaria/[id]/patch: Diária atualizada com sucesso, retornando 200.", updatedDailyLog); // Log 8
        return NextResponse.json(updatedDailyLog, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/diaria/[id]/patch: Erro no bloco catch:", error); // Log 9
        return NextResponse.json(
            { 
                message: "Ocorreu um erro ao atualizar a diária no servidor.",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
    
