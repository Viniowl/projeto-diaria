import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
    try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
        return NextResponse.json({ message : 'Preencha todos os campos' }, { status: 400 });
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return NextResponse.json({ message: 'Email já existe' }, { status: 409 });
    }

    // Hashear a senha
    const hashedPassword = await hashPassword(password);

    // Criar novo usuário
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const {password: _, ...userWithoutPassword} = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 });
    
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
    }

}