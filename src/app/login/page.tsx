import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import { Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
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
                <form>
                    <div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="email" className="text-blue-600">Email</Label>
                            <Input id="email" type="email" placeholder="seu@email.com"/>
                        </div>
                        <div className="flex flex-col space-y-2 border-blue-100 mb-2">
                            <Label htmlFor="password" className="text-blue-600">Senha</Label>
                            <Input id="password" type="password" placeholder="Insira sua senha"/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col ">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
            </CardFooter>
        </Card>
    </div>
  )
  
}