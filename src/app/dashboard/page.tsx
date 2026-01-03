"use client";

import { useState } from "react";
import { useDiarias } from "@/hooks/use-diarias";
import { useUser } from "@/hooks/use-user";
import { DiariaModal } from "@/components/dashboard/diaria-modal";
import { DiariaLogCard } from "@/components/dashboard/diaria-log-card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { type DailyLogUpdateInput, type DailyLog, type DailyLogCreateInput } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function DashboardPage() {

  const {isLoading: isUserLoading} = useUser();
  const {diarias, isLoading: isDiariasLoading, isError, createDiaria, updateDiaria, deleteDiaria } = useDiarias();
  const [editingDiaria, setEditingDiaria] = useState<DailyLog | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectMonth, setSelectedMonth] = useState<string>("");


  if (isUserLoading || isDiariasLoading){
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8 bg-amber-400">
        {/* Skeleton para o Header */}
        <div className=" space-y-2">
          <Skeleton className="h-8 w-1/2"/>
          <Skeleton className="h-8 w-1/3"/>
        </div> 
        {/* Skeleton para SummaryCards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32 rounded-lg"/>
          <Skeleton className="h-32 rounded-lg"/>
        </div>
        {/* Skeleton para a área de filtros e botão */}
        <div className="flex justify_between items-center">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[180px]"/>
            <Skeleton className="h-10 w-[180px]"/>
          </div>
          <Skeleton className="h-10 w-40"/>
        </div>
        {/* Skeleton para os Cards de Diárias */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError){
    return <div className="container mx-auto p-8 text-center text-red-500">Falha ao carregar as Diárias.</div>
  }

  const availableYears = [... new Set(diarias.map(log => new Date(log.date).getFullYear().toString()))].sort((a,b) => b.localeCompare(a));
  const monthsNames: Record<string, string> = {
    '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril', '05': 'Maio', '06': 'Junho',
    '07': 'Julho', '08': 'Agosto', '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
  };

  const availableMonths = [...new Set(diarias.map(log => (new Date(log.date).getMonth() + 1).toString().padStart(2, '0')))].sort();

  const filteredDiarias = diarias.filter(log => {
    const logDate = new Date(log.date);
    const yearMatch = !selectedYear || logDate.getFullYear().toString() === selectedYear;
    const monthMatch = !selectMonth || (logDate.getMonth() + 1).toString().padStart(2, '0') === selectMonth;
    return yearMatch && monthMatch
  });

  const diariasNaoPagas = filteredDiarias.filter(log => log.status === 'NAO_PAGA');
  const diariasPagas = filteredDiarias.filter(log => log.status === 'PAGA');

  const handleCreateDiaria = async (data: DailyLogCreateInput) => {
    try {
      await createDiaria(data);
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Falha ao criar diária: ", error)
    }
  };

  const handleUpdateDiaria = async (data: DailyLogUpdateInput) => {
    if(!editingDiaria) return;
    try {
      await updateDiaria(editingDiaria.id, data);
      setEditingDiaria(null);
    } catch (error) {
      console.error("Falha ao atualizar diária: ",error);
    }
  };

  const handleSubmit = async (data: DailyLogCreateInput | DailyLogUpdateInput) => {
    if (editingDiaria){
      await handleUpdateDiaria(data as DailyLogUpdateInput);
    } else {
      await handleCreateDiaria(data as DailyLogCreateInput);
    }
  };

  const handleOpenEditModal = (log: DailyLog) => {
    setEditingDiaria(log);
  };

  const handleCreateOpenModal = () => {
    setEditingDiaria(null);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDiaria(null);
    setIsFormModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard de Diárias</h1>
        <p className="text-muted-foreground">Visualize e Gerencie suas Diarias</p>
      </header>

      <SummaryCards diarias={filteredDiarias} />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <Select value= {selectedYear} onValueChange={(value) => setSelectedYear(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Anos</SelectItem>
              {availableYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectMonth} onValueChange={(value) => setSelectedMonth(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Meses</SelectItem>
              {availableMonths.map(month => <SelectItem key={month} value={month}>{monthsNames[month]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateOpenModal}>
          Adicionar Nova Diária
        </Button>
      </div>

      <Tabs defaultValue="não pagas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="não pagas">Não Pagas</TabsTrigger>
          <TabsTrigger value="pagas">Pagas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="não pagas" className="mt-4 space-y-4">
          {diariasNaoPagas.map(log => 
            (<DiariaLogCard key={log.id} 
            log={log} 
            onUpdate={updateDiaria} 
            onDelete={deleteDiaria}
            onEdit = {handleOpenEditModal}
            />))}
        </TabsContent>

        <TabsContent value="pagas" className="mt-4 space-y-4">
          {diariasPagas.map(log => (
            <DiariaLogCard key={log.id} 
            log={log} onUpdate={updateDiaria} 
            onDelete={deleteDiaria}
            onEdit = {handleOpenEditModal}
            />))}
        </TabsContent>

        <TabsContent value="todas" className="mt-4 space-y-4">
          {filteredDiarias.map(log => (
            <DiariaLogCard key={log.id} 
            log={log} 
            onUpdate={updateDiaria} 
            onDelete={deleteDiaria}
            onEdit = {handleOpenEditModal}
            />))}
        </TabsContent>
      </Tabs>

      <DiariaModal
        isOpen = {isFormModalOpen || !!editingDiaria}
        onClose = {handleCloseModal}
        onSubmit = {handleSubmit}
        initialData = {editingDiaria}
      />
    </div>
  );
}
