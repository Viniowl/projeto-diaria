"use client";
import Link from 'next/link';
import { Button} from './ui/button';
import { useRouter} from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch ('/api/auth/usuario');

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }  
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
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
              <span className="font-semibold">Olá, {user.name}</span>
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
              <Link href="/register" className="hover:underline">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
