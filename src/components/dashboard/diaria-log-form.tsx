import { useState, type FormEvent } from "react";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button";
import { type DailyLogCreateInput } from "@/lib/types";

interface DiariaLogFormProps{
    onSubmit: (data: DailyLogCreateInput) => void;
}

const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0 ;

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1971-01-01T${endTime}:00`);

    if (end <= start) return 0;

    const diffMilliseconds = end.getTime() - start.getTime();
    return diffMilliseconds / (1000 * 60 * 60);
};

export const DiariaLogForm = ({onSubmit}: DiariaLogFormProps) => {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");

    const hours = calculateHours(startTime, endTime);
    const rate = parseFloat(hourlyRate);
    const totalValue = (hours > 0 && rate > 0) ? (hours * rate) : 0;   
       

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    
        const formData: DailyLogCreateInput = {
            date: new Date(date),
            startTime,
            endTime,
            totalValue
        };

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <h2 className="text-2xl font-bold">Adicionar Nova Diária</h2>
            <div>
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
            </div>
            <div>
                <Label htmlFor="hourlyRate">Seu Valor por Hora (R$)</Label>
                <Input
                id = "hourlyRate" 
                type = "number" 
                step="0.01" 
                placeholder="Ex: 25.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)} required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startTime">Hora de Início</Label>
                    <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="endTime">Hora de Término</Label>
                    <Input id ="endTime" type ="time" value={endTime} onChange={(e) => setEndTime (e.target.value)} required />
                </div>
            </div>
            <div className="mt-4">
                <Label>Valor Total Calculado</Label>
                <p className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</p>
            </div>
            <Button type="submit" className="w-full mt-4">
                Salvar Diária
            </Button>
        </form>
    );
};