"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DailyLog } from "@/lib/types";



export const DiariaLogCard = ({log}: {log: DailyLog}) => {
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
                <Button variant="secondary" size="sm">Marcar como Paga</Button>
            </CardFooter>
        </Card> 
    );
};
