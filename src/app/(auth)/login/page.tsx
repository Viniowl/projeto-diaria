"use client";

import { useState, FormEvent } from "react";
import { useRouter} from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import { Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmitLogin = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        try {
            const response = await fetch('/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            if (response.ok){   
                router.push('/dashboard');
            } else {
                const data = await response.json();
                setError (data.message || 'Ocorreu um erro ao fazer login');
            }
        } catch (err) {
            if (err instanceof Error){
                setError(err.message);
            } else {
                setError("Ocorreu um erro inesperado ao logar.");
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
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <CardFooter className="flex flex-col mt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
                    </CardFooter>
                </form>                                    
             </CardContent>
        </Card>
    </div>
  )
  
}