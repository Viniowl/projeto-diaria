"use client";

import { useState, FormEvent } from "react";
import { useRouter} from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import { Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { z } from "zod";
import { loginSchema, LoginData } from "@/app/_schemas-zod/auth-schemas";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<z.ZodError<LoginData> | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const formErrors = errors ? z.treeifyError(errors)?.properties : null;


    const handleSubmitLogin = async (event: FormEvent) => {
        event.preventDefault();
        setErrors(null);
        setApiError(null);

        const validation = loginSchema.safeParse({email, password});

        if (!validation.success){
            setErrors(validation.error);
            return
        }
        try {
            const response = await fetch('/api/auth/login',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            if (response.ok){   
                router.push('/dashboard');
            } else {
                const data = await response.json();
                setApiError (data.message || 'Ocorreu um erro ao fazer login');
            }
        } catch (err) {
            if (err instanceof Error){
                setApiError(err.message);
            } else {
                setApiError("Ocorreu um erro inesperado ao logar.");
            } 
        }
    }


  return (
    <div className="flex h-full flex-col items-center justify-center p-4 bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-blue-600"><h1>Entre na sua Conta</h1></CardTitle>
                <CardDescription>
                    <p>Insira seus dados para entrar na plataforma</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmitLogin}>
                    <div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="email" className="text-blue-600">Email</Label>
                            <div>
                                <Input 
                                id="email" 
                                type="email" 
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                                />
                            </div>  
                        </div>
                         {formErrors?.email?.errors[0]&& <p className="text-red-500 text-sm mt-1">{formErrors.email.errors[0]}</p>}
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="password" className="text-blue-600">Senha</Label>
                            <div className="relative">
                                <Input 
                                id="password" 
                                type= {showPassword ? "text" : "password"} 
                                placeholder="Insira sua senha" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} required
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
                        </div>
                        {formErrors?.password?.errors[0]&& <p className="text-red-500 text-sm mt-1">{formErrors.password.errors[0]}</p>}
                    </div>
                    {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}

                    <CardFooter className="flex flex-col mt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
                    </CardFooter>
                </form>                                    
             </CardContent>
        </Card>
    </div>
  )
  
}