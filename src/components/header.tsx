"use client";
import Link from 'next/link';
import { Button} from './ui/button';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, isLoading, mutate} = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        mutate(null)
        router.push('/login');
      } else {
        console.error("Erro ao deslogar");
      }
    } catch (error) {
      console.error("Erro ao tentar deslogar:", error);
    }
  }


  return (
    <header className="bg-blue-400 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Home
        </Link>
        <nav className='flex items-center gap-4'>
          {isLoading ? (
            <div className="h-8 w-24 bg-blue-300 rounded animate-pulse"></div>

          ): user ? (
            <>
              <span className="font-semibold">Olá, {user.name.split(' ')[0]}</span>
              <Link href="/dashboard" className="hover:underline">
                Diárias
              </Link>
              <Button 
              onClick={handleLogout}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Entrar
              </Link>
              <Link href="/cadastrar" className="hover:underline">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
