import { CreateDailyLogData, createDailyLogSchema } from "@/app/_schemas-zod/diaria-schema";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../prisma";

export async function createDailyLog(data: CreateDailyLogData, userId: string){
    const validation = createDailyLogSchema.safeParse(data);
    if (!validation.success){
           throw { name: 'ValidationError', issues: validation.error.flatten().fieldErrors };
  }

  try {
    const newDailyLog = await prisma.dailyLog.create({
      data: {
        userId: userId,
        date: validation.data.date,
        startTime: validation.data.startTime,
        endTime: validation.data.endTime,
        totalValue: validation.data.totalValue,
        status: validation.data.status || 'NAO_PAGA',
      },
    });
    return newDailyLog;
  } catch (error) {
    // Captura o erro do Prisma para "entrada duplicada" e lança um erro mais específico
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw { name: 'ConflictError', message: 'Já existe um registro para esta data.' };
    }
    // Re-lança outros erros inesperados
    throw error;
  }
}
