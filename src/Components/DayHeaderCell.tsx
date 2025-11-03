import { memo } from "react";

/**
 * Celda de cabecera por día en la tabla (una columna).
 * Muestra número, día de semana y resalta visualmente el día actual.
 */
export const DayHeaderCell = memo(function DayHeaderCell({
  index,
  day,
  weekday,
  month,
  monthName,
  year,
  today,
}: {
  index: number;
  day: number;
  weekday: string;
  month: number; // índice 0-11
  monthName: string;
  year: number;
  today: Date;
}) {
  const isToday =
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // Mantener fondo alterno y resaltar "Hoy" sin invadir celdas vecinas
  const bgClass = isToday
    ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg ring-inset ring-2 ring-blue-300"
    : index % 2 === 0
    ? "bg-white"
    : "bg-gray-50";

  // Marca sutil de inicio de mes
  const monthStartClass = day === 1 ? "border-l-4 border-indigo-200" : "border-l border-gray-100";

  return (
    <div
      key={index}
      className={`p-3 min-w-[85px]  transition-colors duration-150 h-16 ${bgClass} ${monthStartClass} ${!isToday ? 'hover:bg-blue-100' : ''} ${isToday ? 'hover:from-blue-600 hover:to-indigo-700' : ''} overflow-hidden flex flex-col justify-center items-center text-center`}
      title={`${day} ${monthName} ${year}`}
    >
      <div className={`font-medium flex flex-col items-center justify-center ${isToday ? 'text-white' : 'text-gray-700'}`}>
        <span className={`text-lg font-bold leading-tight ${isToday ? 'text-white' : ''}`}>{day}</span>
        <span className={`text-xs font-semibold leading-tight ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
          {weekday}
        </span>
        {day === 1 && !isToday && (
          <span className="text-[10px] text-indigo-500 font-semibold leading-tight">{monthName}</span>
        )}
        {isToday ? (
          <span className="text-[10px] text-blue-200 font-medium leading-tight">HOY</span>
        ) : (
          <span className="text-[10px] text-gray-400 leading-tight">
            {monthName.slice(0, 3)} {year}
          </span>
        )}
      </div>
    </div>
  );
});

