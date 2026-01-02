import useSWR from "swr";

interface User {
    id: string;
    name: string;
    email: string;
}

const fetcher = async(url: string) => {
    const response = await fetch(url);
    if (!response.ok){
        throw new Error("A resposta da rede não foi bem sucedida")
    }
    return response.json();
}

export function useUser() {
    const {data, error, isLoading, mutate } = useSWR<User | null >('/api/auth/usuario', fetcher);

    return {
        user: data,
        isLoading,
        isError: error,
        mutate
    }
}