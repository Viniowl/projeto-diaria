import {z} from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "E-mail inválido"}),
    password: z.string().min(8, { message: "Senha Incorreta"})
});

export const registerSchema = z.object({
    name: z.string().min(3, {message: "Campo obrigatório"}).max(255),
    email: z.email({ message: "E-mail inválido"}),
    password: z.string().min(8, {message: "Senha deve ter no mínimo 8 caracteres"}),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"]
})

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;