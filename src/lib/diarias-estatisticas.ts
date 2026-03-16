import { type DailyLog } from "@/lib/types";

export function groupDiariasByMonth(diarias: DailyLog[]): Record<number, number> {
  const monthsData: Record<number, number> = {} as Record<number, number>;

  for (let month = 1; month <= 12; month++) {
    monthsData[month] = 0;
  }

  diarias.forEach((diaria) => {
    const month = new Date(diaria.date).getMonth() + 1;
    monthsData[month] = (monthsData[month] || 0) + 1;
  });

  return monthsData;
}

export function formatChartData(monthsData: Record<number, number>, dailyLimit: number = 15) {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return Object.keys(monthsData).map((m) => {
    const monthIndex = parseInt(m, 10) - 1;
    return {
      month: monthNames[monthIndex] ?? m,
      quantidade: monthsData[parseInt(m, 10)] ?? 0,
      limite: dailyLimit,
    };
  });
}
