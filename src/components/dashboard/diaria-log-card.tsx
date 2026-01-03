"use client";

// Imports para estado e formulário foram removidos, pois não são mais necessários aqui.
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DailyLog, DailyLogUpdateInput } from "@/lib/types";

interface DiariaLogCardProps {
    log: DailyLog;
    onUpdate: (id: string, data: DailyLogUpdateInput) => void;
    onDelete: (id: string) => void;
    // Aceita a nova prop onEdit para notificar o componente pai.
    onEdit: (log: DailyLog) => void;
};

export const DiariaLogCard = ({log, onUpdate, onDelete, onEdit}: DiariaLogCardProps) => {
    
    // Toda a lógica de estado para edição inline foi removida.

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir a diária de ${new Date(log.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}?`)){
            onDelete(log.id);
        }
    };

    const statusDisplay = {
        PAGA: { text: 'Paga', variant: 'success' as const },
        NAO_PAGA: { text: 'Não Paga', variant: 'destructive' as const }
    };

    const displayStatus = statusDisplay[log.status as keyof typeof statusDisplay] || { text: log.status, variant: 'secondary' as const };

    // O JSX foi simplificado, removendo a renderização condicional do formulário.
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Diária de {new Date(log.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</CardTitle>
                <Badge variant={displayStatus.variant}>
                    {displayStatus.text}
                </Badge>
            </CardHeader>
            <CardContent>
                <p><strong>Horário:</strong> {log.startTime} às {log.endTime}</p>
                <p className="text-xl font-semibold mt-2">Valor: R$ {Number(log.totalValue).toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {/* O botão "Editar" agora chama a função onEdit recebida via props. */}
                <Button variant="outline" size="sm" onClick={() => onEdit(log)}>
                    Editar
                </Button>

                {log.status === 'NAO_PAGA' && (
                    <Button variant="success" 
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
