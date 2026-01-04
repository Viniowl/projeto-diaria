import { CreateDailylogSchema, createDailylogSchema } from "@/app/_schemas-zod/diaria-schema";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../prisma";

export async function createDailyLog(data: CreateDailylogSchema, userId: string){
    const validation = createDailylogSchema.safeParse(data);
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

export async function listDailyLogs(
  userId: string,
  year?: number,
  month?: number
) {
  try {
    let dateFilter: Prisma.DateTimeFilter = {};

    if (year !== undefined) {
      const startDate = new Date(year, (month !== undefined ? month - 1 : 0), 1);
      let endDate;
      if (month !== undefined) {
        endDate = new Date(year, month, 1); // Start of next month
      } else {
        endDate = new Date(year + 1, 0, 1); // Start of next year
      }

      dateFilter = {
        gte: startDate,
        lt: endDate,
      };
    }

    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: userId,
        date: dateFilter,
      },
      orderBy: {
        date: 'desc'
      }
    });
    return dailyLogs;
  } catch (error) {
    console.error("Erro no serviço ao buscar DailyLogs", error);
    throw new Error("Não foi possivel buscar os registros no banco de dados");
  }
}