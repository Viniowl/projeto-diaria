import z from "zod";

export const createDailyLogSchema = z.object({
    date: z.coerce.date().refine(d => !Number.isNaN(d.getTime()), {message : "Data Inválida"}),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Formato de hora de início inválido" }),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Formato de hora de término inválido" }),
    totalValue: z.number().positive({ message: "O valor total deve ser positivo"}),
    status: z.enum(["PAGA", "NAO_PAGA"]).optional()
});

export type CreateDailyLogData = z.infer<typeof createDailyLogSchema>;

