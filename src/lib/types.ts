export type DailyLog = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    totalValue: number;
    status: "paga" | "não paga";
}