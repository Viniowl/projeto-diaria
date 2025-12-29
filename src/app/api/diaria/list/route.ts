import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyToken} from "@/lib/auth";
import { listDailyLogs } from "@/lib/server/diaria_services";

export async function GET(_req: Request) {
    try {
        const authorization = (await headers()).get("authorization");
        if(!authorization || !authorization.startsWith('Bearer')){
            return NextResponse.json({ error: "Token de autorização não encontrado"}, { status: 401});
        }

        const token = authorization.split(' ')[1];

        const decodedToken = verifyToken(token);
        if(!decodedToken?.userId){
            return NextResponse.json({ error: "Token de autorização inválido"}, { status: 401});
        }

        const userId = decodedToken.userId;

        const dailyLogs = await listDailyLogs(userId);
        return NextResponse.json(dailyLogs, { status: 200});


    } catch (error) {
        console.error("Erro ao listar registros de diaria: ",error);
        return NextResponse.json({ error: "Erro interno do servidor"}, { status: 500});
    
        
    }
    
}