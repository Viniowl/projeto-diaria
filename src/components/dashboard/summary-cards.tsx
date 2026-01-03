import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { type DailyLog } from "@/lib/types";

interface SummaryCardsProps {
    diarias: DailyLog[];
}
export const SummaryCards = ({ diarias }: SummaryCardsProps) => {
    const totalToReceive = diarias.filter(diaria => diaria.status === 'NAO_PAGA').reduce((acc, diaria) => acc + Number(diaria.totalValue), 0);
    const totalReceived = diarias.filter(diaria => diaria.status === 'PAGA').reduce((sum, diaria) => sum + Number(diaria.totalValue), 0 );

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