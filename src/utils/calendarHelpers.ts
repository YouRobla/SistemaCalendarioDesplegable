// Nombres de meses en español (0-11)
export const months = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Tipo base para cada celda de calendario/día generado
export interface CalendarDay {
  day: number;        // día del mes (1-31)
  weekday: string;    // nombre corto del día de la semana (ej. "lun")
  month: number;      // índice de mes (0-11)
  monthName: string;  // nombre del mes (ej. "Enero")
  year: number;       // año numérico (ej. 2025)
}

/**
 * Genera un arreglo plano con todos los días
 * desde `startYear` hasta `startYear + 1` (2 años)
 */
export const generateAllDays = (startYear: number): CalendarDay[] => {
  return Array.from({ length: 2 }, (_, yearOffset) => {
    const y = startYear + yearOffset;
    return Array.from({ length: 12 }, (_, month) => {
      const daysInMonth = new Date(y, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const day = dayIndex + 1;
        const date = new Date(y, month, day);
        const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });
        return { day, weekday, month, monthName: months[month], year: y };
      });
    }).flat();
  }).flat();
};
