import { type DiariaFormSchema } from "@/app/_schemas-zod/diaria-schema";

export type DailyLog = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    totalValue: number;
    status: "PAGA" | "NAO_PAGA";
};

export type DailyLogCreateInput = DiariaFormSchema;
export type DailyLogUpdateInput = Partial<DiariaFormSchema>;