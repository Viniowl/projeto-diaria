import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token){
        return NextResponse.json({ message: "Não autorizado"}, { status: 401});
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken){
        return NextResponse.json({ message: "Token Inválido"}, { status: 401});
    }
    
    const { userId } = decodedToken ;

    try {
        const { id } = context.params;

        const {count} = await prisma.dailyLog.deleteMany({
            where: {
                id: id,
                userId: userId
            }
        });

        if (count === 0){
            return NextResponse.json(
                {message: "Diária não encontrada ou não pertence ao usuário"},
                {status: 404}
            );
        }

        return NextResponse.json(
            {message: "Diária deletada com sucesso"}, 
            {status: 200}
        );
    } catch (error) {
        console.error("Erro ao deletar diária:", error);
        return NextResponse.json(
            { message: "Erro ao deletar diária" }, 
            { status: 500 }
        );
    }
}