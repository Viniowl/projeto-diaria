import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Não autorizado: Token não encontrado.' }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    // Se o token for inválido, é uma boa prática instruir o navegador a removê-lo
    const response = NextResponse.json({ message: 'Não autorizado: Token inválido.' }, { status: 401 });
    response.cookies.set('auth_token', '', { expires: new Date(0) });
    return response;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
