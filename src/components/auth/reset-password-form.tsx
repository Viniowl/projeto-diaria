"use client";

import { useState, FormEvent, Suspense} from "react";
import { useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { z } from 'zod';
import Link from "next/link";
import { ResetPasswordData, resetPasswordSchema } from '@/app/_schemas-zod/auth-schemas';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Eye, EyeClosed, CheckCircle } from "lucide-react";

export function ResetPasswordFormComponent() {
    const searchParams = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<z.ZodError<ResetPasswordData>| null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        console.log("handleSubmit triggered");
        e.preventDefault();
        setErrors(null);
        setApiError(null);
        setIsSubmitting(true);

        const token = searchParams.get('token');

        const validation = resetPasswordSchema.safeParse({
            password,
            confirmPassword,
            token
        });

        if (!validation.success){
            setErrors(validation.error);
            console.log("Form validation errors:", validation.error);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('api/auth/reset-password', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validation.data)
            });

            const result = await response.json();

            if (!response.ok){
                setApiError(result.message || "Ocorreu um erro ao redefinir a senha");
            } else{
                setSuccessMessage("Sua senha foi redefinida com sucesso");
            }
        } catch (_error) {
            setApiError("Não foi possivel conectar com o servidor. Tente novamente mais tarde")   
        } finally{
            setIsSubmitting(false);
        }
    };

    const formErrors = errors ? z.treeifyError(errors)?.properties: null;

    if (successMessage) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4 bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="text-center">
                        {/* O CheckCircle pode vir aqui para mais destaque */}
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <CardTitle>Sucesso!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Sua senha foi redefinida. Agora você já pode acessar sua conta.
                        </p>
                        <Button asChild className="mt-4 w-full" variant="blue">
                            <Link href="/login">
                                Ir para o Login
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return(
        <div className="flex h-full flex-col items-center justify-center p-4 bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
            <Card className="w-full max-w-md mx-auto flex flex-col">
                <CardHeader className="text-center">
                    <CardTitle>Redefinir Senha</CardTitle>
                    <CardDescription>Digite sua nova senha abaixo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua nova senha"
                                />
                                <Button 
                                type = "button"
                                variant= "ghost"
                                size = "icon"
                                className="absolute right-0 top-0 h-full w-10 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeClosed size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </Button>
                            </div>
                            {formErrors?.password?.errors[0] && (
                                <p className="text-red-500 text-sm">{formErrors.password.errors[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua nova senha"
                                />
                                <Button 
                                type = "button"
                                variant= "ghost"
                                size = "icon"
                                className="absolute right-0 top-0 h-full w-10 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeClosed size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </Button>
                            </div>
                            {formErrors?.confirmPassword?.errors[0] && (
                                <p className="text-red-500 text-sm">{formErrors.confirmPassword.errors[0]}</p>
                            )}
                        </div>
                        
                        {apiError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Erro</AlertTitle>
                                <AlertDescription>{apiError}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" variant="blue" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export function ResetPasswordForm() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ResetPasswordFormComponent />
        </Suspense>
    )
}

