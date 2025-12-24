import { formatInTimeZone } from "date-fns-tz"

// Converter horário de Brasília para DateTime
export function formatToBrasilia(date: Date, format: string = "dd/MM/yyyy HH:mm:ss"): string {
  return formatInTimeZone(date, "America/Sao_Paulo", format)
}