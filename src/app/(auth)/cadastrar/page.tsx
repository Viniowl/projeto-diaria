"use client";

import {Eye, EyeClosed} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, FormEvent} from "react"; 

export default function CadastrarPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState< string | null >(null);
    const router = useRouter();


    const handleSubmitCadastro = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
    
        try {
            const response = await fetch('/api/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password})
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Falha ao cadastrar usuário');
            }

            router.push('/dashboard');
            
        } catch (err) {
            if (err instanceof Error){
                setError(err.message);
            } else {
                setError("Ocorreu um erro inesperado ao cadastrar o usuário.");
            } 
        }

    };


    return (
    <div className="flex h-full flex-col items-center justify-center p-4 bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-blue-600"><h1>Crie sua Conta</h1></CardTitle>
                <CardDescription>
                    <p>Insira seus dados para se cadastrar na plataforma</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit= {handleSubmitCadastro}>
                    <div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="name" className="text-blue-600">Nome</Label>
                            <Input id="name" placeholder="Digite seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="email" className="text-blue-600">Email</Label>
                            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="password" className="text-blue-600">Senha</Label>
                            <div className="relative">
                                <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Criar senha" 
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
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="confirm-password" className="text-blue-600">Confirmar Senha</Label>
                            <div className="relative">
                                <Input 
                                id="confirm-password" 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmar sua senha" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} required
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
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <CardFooter className="flex flex-col mb-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-1.5">Cadastrar</Button>
                        <p className="text-sm text-center text-muted-foreground mt-3">
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Já possui uma conta? 
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </CardContent>
        </Card> 
    </div>
  )
}