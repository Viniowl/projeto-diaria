import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function CadastrarPage() {
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
                <form>
                    <div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="name" className="text-blue-600">Nome</Label>
                            <Input id="name" placeholder="Digite seu nome completo"/>
                        </div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="email" className="text-blue-600">Email</Label>
                            <Input id="email" type="email" placeholder="seu@email.com"/>
                        </div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="password" className="text-blue-600">Senha</Label>
                            <Input id="password" type="password" placeholder="Criar senha"/>
                        </div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="confirm-password" className="text-blue-600">Confirmar Senha</Label>
                            <Input id="confirm-password" type="password" placeholder="Confirmar sua senha"/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col ">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" >Cadastrar</Button>
                <p className="text-sm text-center text-muted-foreground mt-2">
                    <Link href="/login" className="text-blue-600 hover:underline">
                            Já possui uma conta? 
                    </Link>
                </p>
            </CardFooter>
        </Card> 
    </div>
  )
}