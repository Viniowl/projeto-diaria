import { NextResponse, type NextRequest } from "next/server";
import { verifyToken} from "@/lib/auth";
import { listDailyLogs } from "@/lib/server/diaria_services";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export async function GET(request: NextRequest) {
    try {
        await sleep(1000);
        const tokenCookie = request.cookies.get("auth_token");
        if(!tokenCookie){
            return NextResponse.json({ error: "Token de autorização não encontrado"}, { status: 401});
        }

        const token = tokenCookie.value;

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