import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // O principal objetivo do logout é invalidar o cookie de autenticação.
  // Fazemos isso criando um novo cookie com o mesmo nome,
  // mas com uma data de expiração no passado e conteúdo vazio.

  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Define a data de expiração para o passado
    path: '/',
    sameSite: 'lax',
  });

  const response = NextResponse.json(
    { message: "Logout bem-sucedido!" },
    { status: 200 }
  );

  response.headers.set('Set-Cookie', cookie);

  return response;
}
