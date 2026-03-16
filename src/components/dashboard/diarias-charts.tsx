"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { type DailyLog } from "@/lib/types";
import { groupDiariasByMonth, formatChartData } from "@/lib/diarias-estatisticas";

interface DiariasChartProps {
    diarias: DailyLog[];
    dailyLimit?: number;
}

export const DiariasChart = ({ diarias, dailyLimit = 15 }: DiariasChartProps) => {
    const monthsData = groupDiariasByMonth(diarias);
    const chartData = formatChartData(monthsData, dailyLimit);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Diárias por Mês</CardTitle>
                <CardDescription>Comparação com o limite mensal de {dailyLimit} diárias</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={dailyLimit} stroke="#ef4444" strokeDasharray="5 5" ifOverflow="extendDomain" />
                        <Bar dataKey="quantidade" fill="#3b82f6" name="Diárias" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};