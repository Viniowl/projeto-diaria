import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // Importa a função 'headers' do Next.js
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // Importa a função correta
import { z } from 'zod';

const createDailyLogSchema = z.object({
  date: z.coerce.date().refine(d => !Number.isNaN(d.getTime()), { message: "Data Inválida" }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  totalValue: z.number().positive(),
  status: z.enum(['PAGA', 'NAO_PAGA']).optional(),
});

export async function POST(req: Request) {
  // 1. Obter o token do cabeçalho da requisição
  const authorization = (await headers()).get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token de autorização ausente ou mal formatado' }, { status: 401 });
  }
  const token = authorization.split(' ')[1];

  // 2. Verificar o token e obter o ID do usuário
  const decodedToken = verifyToken(token);
  if (!decodedToken?.userId) {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
  }

  const userId = decodedToken.userId;

  // O resto da lógica permanece o mesmo...
  try {
    const body = await req.json();
    const validation = createDailyLogSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({
        error: "Dados de entrada inválidos",
        issues: validation.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const newDailyLog = await prisma.dailyLog.create({
      data: {
        userId: userId, // Usa o ID obtido do token
        date: validation.data.date,
        startTime: validation.data.startTime,
        endTime: validation.data.endTime,
        totalValue: validation.data.totalValue,
        status: validation.data.status || 'NAO_PAGA',
      },
    });

    return NextResponse.json(newDailyLog, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'Já existe um registro para esta data.' }, { status: 409 });
    }
    console.error('Erro ao criar registro diário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}