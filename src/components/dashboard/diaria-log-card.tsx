"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DailyLog, DailyLogUpdateInput } from "@/lib/types";

interface DiariaLogCardProps {
    log: DailyLog;
    onUpdate: (id: string,data: DailyLogUpdateInput) => void;
    onDelete: (id: string) => void;
};

export const DiariaLogCard = ({log, onUpdate, onDelete}: DiariaLogCardProps) => {
    
    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir a diária de ${log.date}?`)){
            onDelete(log.id);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Diária de {log.date}</CardTitle>
                <Badge variant = {log.status === 'paga' ? 'default' : 'destructive'}>
                    {log.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <p><strong>Horário:</strong> {log.startTime} às {log.endTime}</p>
                <p className="text-xl font-semibold mt-2">Valor: R$ {log.totalValue.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                {log.status === 'não paga' && (
                    <Button variant="secondary" 
                    size="sm"
                    onClick={() => onUpdate(log.id, {status: 'PAGA'})}
                    >
                        Marcar como Paga
                    </Button>
                )}
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    Deletar
                </Button>
            </CardFooter>
        </Card> 
    );
};
