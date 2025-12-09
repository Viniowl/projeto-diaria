import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CadastrarPage() {
  return (
    <main>
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <Card className="w-full max-w-md bg-red-400">
               <CardHeader className="text-center">
                    <CardTitle><h1>Crie sua Conta</h1></CardTitle>
                    <CardDescription>
                        <p>Insera seus dados para se cadastrar na plataforma</p>
                    </CardDescription>
               </CardHeader>
               <CardContent>
                    <form>
                        <div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" placeholder="Digite seu nome completo"></Input>
                            </div>
                             <div className="flex flex-col space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="seu@email.com"></Input>
                            </div>
                             <div className="flex flex-col space-y-2">
                                <Label htmlFor="senha">Senha</Label>
                                <Input id="senha" type="password" placeholder="Crie um senha forte"></Input>
                            </div>
                        </div>
                    </form>
               </CardContent>
            </Card> 
        </div>
    </main>
  )
}