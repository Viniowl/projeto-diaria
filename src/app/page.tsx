import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="flex h-screen flex-col items-center justify-center bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
        <Card className="w-full max-w-sm bg-white/80 p-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle><h1>Bem-Vindo</h1></CardTitle>
              <CardDescription>
                <p>Aqui você pode guardar as suas diárias</p>
              </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
                <Link href="/cadastrar">Cadastrar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
            
            