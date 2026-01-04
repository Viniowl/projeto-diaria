import { useState, type FormEvent } from "react";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button";
import { type DailyLogCreateInput, type DailyLog, type DailyLogUpdateInput } from "@/lib/types";

interface DiariaLogFormProps{
    onSubmit: (data: DailyLogCreateInput | DailyLogUpdateInput) => void;
    initialData: DailyLog | null;
}

const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0 ;

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (end <= start) {
        end.setDate(end.getDate() + 1);
    }

    const diffMilliseconds = end.getTime() - start.getTime();
    return diffMilliseconds / (1000 * 60 * 60);
};

export const DiariaLogForm = ({onSubmit, initialData}: DiariaLogFormProps) => {
    const [date, setDate] = useState(initialData ? new Date(initialData.date).toISOString().split('T')[0] : "");
    const [startTime, setStartTime] = useState(initialData?.startTime ?? "");
    const [endTime, setEndTime] = useState(initialData?.endTime ?? "");
    const [hourlyRate, setHourlyRate] = useState("");

    const hours = calculateHours(startTime, endTime);
    const rate = parseFloat(hourlyRate);

    // Use existing totalValue from initialData if it exists and hourly rate is not being re-entered
    const totalValue = (hours > 0 && rate > 0) ? (hours * rate) : (initialData?.totalValue ?? 0);   
       
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const calculatedTotal = (hours > 0 && rate > 0) ? (hours * rate) : (initialData?.totalValue ?? 0);

        const dataToSubmit = {
            date: new Date(date),
            startTime,
            endTime,
            totalValue: calculatedTotal,
        };
    
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <h2 className="text-2xl font-bold">{initialData ? "Editar Diária" : "Adicionar Nova Diária"}</h2>
            <div>
                <Label htmlFor="date" className="mb-2">Data</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
            </div>
            <div>
                <Label htmlFor="hourlyRate" className="mb-2">Seu Valor por Hora (R$)</Label>
                <Input
                id = "hourlyRate" 
                type = "number" 
                step="0.01" 
                placeholder="Ex: 25.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)} 
                required={!initialData} // Only required when creating a new entry
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startTime" className="mb-2">Hora de Início</Label>
                    <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="endTime" className="mb-2">Hora de Término</Label>
                    <Input id ="endTime" type ="time" value={endTime} onChange={(e) => setEndTime (e.target.value)} required />
                </div>
            </div>
            <div className="mt-4">
                <Label>Valor Total Calculado</Label>
                <p className="text-2xl font-bold">R$ {Number(totalValue).toFixed(2)}</p>
            </div>
            <Button type="submit" className="w-full mt-4">
                {initialData ? "Salvar Alterações" : "Salvar Diária"}
            </Button>
        </form>
    );
};