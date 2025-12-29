import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '../../../generated/prisma/client';

// Esquema de validação dos dados da diária
export const createDailyLogSchema = z.object({
  date: z.coerce.date().refine(d => !Number.isNaN(d.getTime()), { message: "Data Inválida" }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Formato de hora de início inválido" }),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Formato de hora de término inválido" }),
  totalValue: z.number().positive({ message: "O valor total deve ser positivo" }),
  status: z.enum(['PAGA', 'NAO_PAGA']).optional(),
});

// Tipagem inferida a partir do schema do Zod
export type CreateDailyLogData = z.infer<typeof createDailyLogSchema>;

/**
 * Cria um novo registro de diária no banco de dados.
 * @param data Os dados da diária a ser criada.
 * @param userId O ID do usuário associado.
 * @returns O registro da diária criada.
 * @throws Lança um erro se a validação falhar ou se houver um conflito no banco de dados.
 */
export async function createDailyLog(data: CreateDailyLogData, userId: string) {
  // A validação agora é feita aqui, no início da lógica de negócio.
  const validation = createDailyLogSchema.safeParse(data);
  if (!validation.success) {
    // Lançamos um erro com os detalhes da validação
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
