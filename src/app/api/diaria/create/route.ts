import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { createDailyLog } from '@/services/diaria.service';

export async function POST(req: Request) {
  try {
    // 1. Obter e verificar o token de autorização
    const authorization = (await headers()).get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização ausente ou mal formatado' }, { status: 401 });
    }
    const token = authorization.split(' ')[1];

    const decodedToken = verifyToken(token);
    if (!decodedToken?.userId) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }
    const userId = decodedToken.userId;

    // 2. Chamar o serviço com os dados da requisição
    const body = await req.json();
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