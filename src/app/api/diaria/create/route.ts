import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createDailyLog } from '@/lib/server/diaria_services';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
        return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }
    const { userId } = decodedToken;

    // 2. Chamar o serviço com os dados da requisição
    const body = await request.json();
    const newDailyLog = await createDailyLog(body, userId);

    // 3. Retornar sucesso
    return NextResponse.json(newDailyLog, { status: 201 });

  } catch (error) {
    // 4. Mapear erros específicos do serviço para respostas HTTP de forma type-safe
    if (typeof error === 'object' && error !== null && 'name' in error) {
      const customError = error as { name: string; message?: string; issues?: unknown };

      if (customError.name === 'ValidationError') {
        return NextResponse.json({
          error: "Dados de entrada inválidos",
          issues: customError.issues
        }, { status: 400 });
      }
  
      if (customError.name === 'ConflictError') {
        return NextResponse.json({ error: customError.message }, { status: 409 });
      }
    }

    // 5. Lidar com erros genéricos
    console.error('Erro ao criar registro diário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}