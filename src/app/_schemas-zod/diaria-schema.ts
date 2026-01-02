import { z } from "zod";

export const diariaFormSchema = z.object({
    date: z.coerce.date().refine(d => !Number.isNaN(d.getTime()), {message : "Data Inválida"}),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Formato de hora de início inválido" }),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Formato de hora de término inválido" }),
    totalValue: z.number().positive({ message: "O valor total deve ser positivo"}),
    status: z.enum(["PAGA", "NAO_PAGA"]).optional()
});

export type DiariaFormSchema = z.infer<typeof diariaFormSchema>;

export const createDailylogSchema = diariaFormSchema.extend({
    date: z.coerce.date(),
    status: z.enum (["PAGA", "NAO_PAGA"]).optional()
});

export type CreateDailylogSchema = z.infer<typeof createDailylogSchema>;

export const updateDailylogSchema = diariaFormSchema.partial();
export type UpdateDailyLogData = z.infer<typeof updateDailylogSchema>