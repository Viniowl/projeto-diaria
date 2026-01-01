import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { type DailyLog } from "@/lib/types";

interface SummaryCardsProps {
    diarias: DailyLog[];
}
export const SummaryCards = ({ diarias }: SummaryCardsProps) => {
    const totalToReceive = diarias.filter(diaria => diaria.status === 'não paga').reduce((acc, diaria) => acc + diaria.totalValue, 0);
    const totalReceived = diarias.filter(diaria => diaria.status === 'paga').reduce((sum, diaria) => sum + diaria.totalValue, 0 );

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Total a Receber</CardTitle>
                    <CardDescription>Soma de todas as Diárias não pagas</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">R$ {totalToReceive.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Recebido</CardTitle>
                    <CardDescription>Soma de todas as Diárias pagas</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">R$ {totalReceived.toFixed(2)}</p>
                </CardContent>
            </Card>
        </div>
    )
}