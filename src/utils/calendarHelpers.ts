export const months = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const generateAllDays = (startYear: number) => {
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
