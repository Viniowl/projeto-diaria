import useSWR from 'swr';
import { type DailyLog, type DailyLogCreateInput, type DailyLogUpdateInput} from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(response =>{
    if (!response.ok){
        throw new Error("A resposta da rede não foi bem sucedida")
    }
    return response.json();
});

export function useDiarias(){
    const{ data, error, isLoading, mutate } = useSWR<DailyLog[]>('/api/diaria/list', fetcher);
    
    const createDiaria = async (diaria: DailyLogCreateInput) => {
        const response = await fetch('/api/diaria/create',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(diaria)
        });
        if (!response.ok) throw new Error ("Falha ao criar Diária");
        mutate();
    };

    const updateDiaria = async (id: string, diaria: DailyLogUpdateInput) => {
        const response = await fetch(`/api/diaria/${id}/patch`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(diaria)
        });
        if (!response.ok) throw new Error ("Falha ao atualizar Diária");
        mutate();    
    }

    const deleteDiaria = async (id: string) => {
    const response = await fetch(`/api/diaria/${id}/delete`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao deletar a diária.');
    mutate();
  };

  return {
    diarias: data ?? [],
    isLoading,
    isError: error,
    createDiaria,
    updateDiaria,
    deleteDiaria,
  };
}