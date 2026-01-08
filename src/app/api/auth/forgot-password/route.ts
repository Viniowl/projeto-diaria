import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/app/_schemas-zod/auth-schemas";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = forgotPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({ where: {email} });

        if (!user) {
            return NextResponse.json({ message: "Se o e-mail estiver correto, um link de recuperação será enviado." }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { email },
            data: {
                passwordResetToken,
                passwordResetExpires,
            }
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Redefinição de Senha",
            html: `
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  <h1 style="color: #333; text-align: center;">Redefinição de Senha</h1>
                  <p style="font-size: 16px; color: #555;">Olá,</p>
                  <p style="font-size: 16px; color: #555;">Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para escolher uma nova senha.</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Redefinir Senha</a>
                  </div>
                  <p style="font-size: 16px; color: #555;">Se você não solicitou uma redefinição de senha, por favor, ignore este e-mail.</p>
                  <p style="font-size: 14px; color: #888; margin-top: 20px;">O link de redefinição expirará em 1 hora.</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; 2026 Diária Log. Todos os direitos reservados.</p>
                </div>
              </body>
            `,
        });

     return NextResponse.json({ message: "Email enviado com sucesso!" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Ocorreu um erro", error }, { status: 500 });
    }
};
