import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const SummaryCards = () => {
    const totalToReceive = 150.75 + 85.50;
    const totalReceived = 50.00;

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