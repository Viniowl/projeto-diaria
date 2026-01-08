"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch('api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || "Algo deu Errado");
            }

            setMessage(data.message);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Algo deu errado");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return(
    <div className="flex h-full flex-col items-center justify-center bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
      <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-2xl text-center">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-center text-gray-600">
            Sem problemas. Digite o e-mail cadastrado e enviaremos um link para você
            redefinir sua senha.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="email" className="mb-2">E-mail</Label>
                    <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    />
                </div>
                <Button type="submit" variant="blue" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar link de redefinição'}
                </Button>
            </form>
            {message && (<p className="text-green-600 text-center mt-2.5">{message}</p>)}
            {error && (<p className="text-red-600 text-center mt-2.5">{error}</p>)}
        </CardContent>
      </Card>
    </div>
  );
};

