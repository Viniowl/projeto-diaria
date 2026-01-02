import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken } from '@/lib/auth';
import { z } from 'zod';
import { serialize } from 'cookie';

// Esquema de validação com Zod
const LoginSchema = z.object({
  email: z.email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validar dados de entrada
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Dados de login inválidos.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 2. Encontrar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email },
      select: {id: true, name: true, email: true, password: true}
    });

    if (!user) {
      // Usamos uma mensagem genérica para não informar se o e-mail existe ou não
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 3. Verificar a senha
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // 4. Criar o token JWT
    const token = createToken(user.id);

    // 5. Serializar o cookie para a resposta
    const cookie = serialize('auth_token', token, {
      httpOnly: true, // Impede acesso via JavaScript no cliente
      secure: process.env.NODE_ENV === 'production', // Usar 'secure' em produção (HTTPS)
      maxAge: 60 * 60 * 24, // 1 dia em segundos
      path: '/', // O cookie estará disponível em todo o site
      sameSite: 'lax', // Proteção contra ataques CSRF
    });


    const { password: _, ...userWithoutPassword } = user;

    // 6. Retornar resposta de sucesso com o cookie no cabeçalho
    const response = NextResponse.json({
       message: "Login bem-sucedido!",
       user: userWithoutPassword
      }, { status: 200 }
    );
    response.headers.set('Set-Cookie', cookie);
    
    return response;

  } catch (error) {
    console.error("Erro na rota de login:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro no servidor." },
      { status: 500 }
    );
  }
}

