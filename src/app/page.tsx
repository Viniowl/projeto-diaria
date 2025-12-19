import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, CheckCircle, Lock, ClipboardPen} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[url('/images/bg-logistica.png')] bg-cover bg-center">
      <Card className="mx-auto w-full max-w-md bg-white/85 p-8 shadow-2xl border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <ClipboardPen className="h-8 w-20 text-blue-600"/>
            </div>
          </div>
          <CardTitle className="text-lg mt-3"><h1>Bem-Vindo!</h1></CardTitle>
          <CardDescription className="text-3x1 mt-1">
            <p>Gerencie suas diárias de forma simples e eficiente</p>
          </CardDescription>
        </CardHeader>

        <div className="mb-3 text-left space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
            <p className="text-gray-700">Registre suas diárias rapidamente</p>
          </div>
          <div className="flex items-start gap-3">
            <BarChart2 className="h-6 w-6 text-blue-500 mt-1" />
            <p className="text-gray-700">Acompanhe seus ganhos</p>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 text-gray-500 mt-1" />
            <p className="text-gray-700">Seus dados seguros e privados</p>
          </div>
        </div>
  
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            <Link href="/cadastrar">Criar Conta</Link>
          </Button>
          <p className="text-sm text-center text-gray-600 w-full">
            Já tem uma conta? {" "}
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
            
            