import { NextResponse, type NextRequest } from "next/server";
import { verifyToken} from "@/lib/auth";
import { listDailyLogs } from "@/lib/server/diaria_services";

//const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export async function GET(request: NextRequest) {
    try {
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
        const yearParam = request.nextUrl.searchParams.get("year");
        const monthParam = request.nextUrl.searchParams.get("month");
        
        const year = yearParam && !isNaN(Number(yearParam)) ? parseInt(yearParam) : undefined;
        const month = monthParam && !isNaN(Number(monthParam)) ? parseInt(monthParam) : undefined;


        const dailyLogs = await listDailyLogs(userId, year, month);
        return NextResponse.json(dailyLogs, { status: 200});


    } catch (error) {
        console.error("Erro ao listar registros de diaria: ",error);
        return NextResponse.json({ error: "Erro interno do servidor"}, { status: 500});
    
        
    }
    
}