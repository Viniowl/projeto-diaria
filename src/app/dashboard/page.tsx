"use client";
import { useState } from "react";
import { DiariaLogCard } from "@/components/dashboard/diaria-log-card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DiariaLogForm } from "@/components/dashboard/diaria-log-form";
import { type DailyLog } from "@/lib/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const logsExemplo: DailyLog[] = [
  { id: '1', date: '2024-06-01', startTime: '09:00', endTime: '17:00', totalValue: 100, status: 'paga' },
  { id: '2', date: '2024-06-02', startTime: '10:00', endTime: '18:00', totalValue: 150, status: 'não paga' },
  { id: '3', date: '2024-06-03', startTime: '08:30', endTime: '16:30', totalValue: 120, status: 'paga' },
];

export default function DashboardPage() {

  const [logs, setLogs] = useState(logsExemplo);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const diariasNaoPagas = logs.filter(log => log.status === 'não paga');
  const diariasPagas = logs.filter(log => log.status === 'paga');

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard de Diárias</h1>
        <p className="text-muted-foreground">Visualize e Gerencie suas Diarias</p>
      </header>

      <SummaryCards />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Ano</SelectLabel>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">Janeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsFormModalOpen(true)}>
          Adicionar Nova Diária
        </Button>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setIsFormModalOpen(false)}>
          <div className="bg-card p-8 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <DiariaLogForm />
            <Button variant="ghost" onClick={() => setIsFormModalOpen(false)} className="w-full mt-2">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="não pagas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="não pagas">Não Pagas</TabsTrigger>
          <TabsTrigger value="pagas">Pagas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="não pagas" className="mt-4 space-y-4">
          {diariasNaoPagas.map(log => <DiariaLogCard key={log.id} log={log} />)}
        </TabsContent>

        <TabsContent value="pagas" className="mt-4 space-y-4">
          {diariasPagas.map(log => <DiariaLogCard key={log.id} log={log} />)}
        </TabsContent>

        <TabsContent value="todas" className="mt-4 space-y-4">
          {logs.map(log => <DiariaLogCard key={log.id} log={log} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
