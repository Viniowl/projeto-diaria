import { type DiariaFormSchema } from "@/app/_schemas-zod/diaria-schema";

export type DailyLog = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    totalValue: number;
    status: "paga" | "não paga";
};

export type DailyLogCreateInput = DiariaFormSchema;
export type DailyLogUpdateInput = Partial<DiariaFormSchema>;