import { MonthSelect } from "./MonthSelect";

interface CalendarControlsProps {
  months: string[];
  selectedMonth: number; // 0-11
  selectedDay: number;   // 1-31
  year: number;          // año de referencia para validar días
  onMonthChange: (month: number) => void;
  onDayChange: (day: number) => void;
  onScrollToToday: () => void;
  onGoToSelectedDate: () => void;
}

// Controles del calendario: botón Hoy, selector de mes y campo día.
export const CalendarControls = ({
  months,
  selectedMonth,
  selectedDay,
  year,
  onMonthChange,
  onDayChange,
  onScrollToToday,
  onGoToSelectedDate,
}: CalendarControlsProps) => {
  const maxDay = new Date(year, selectedMonth + 1, 0).getDate();
  const safeDay = Math.min(Math.max(1, selectedDay), maxDay);

  const handleDayChange = (value: number) => {
    const clamped = Math.min(Math.max(1, value), maxDay);
    onDayChange(clamped);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Botón Hoy */}
      <button
        onClick={onScrollToToday}
        className=" items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Ir a hoy"
      >
        Hoy
      </button>

      {/* Controles de fecha */}
      <div className="relative flex items-stretch rounded-lg border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm focus-within:ring-2 focus-within:ring-indigo-500">
        <div className="flex items-center px-3 py-2">
          <span className="mr-2 hidden text-sm text-gray-500 sm:block">Mes</span>
          <MonthSelect months={months} value={selectedMonth} onChange={onMonthChange} />
        </div>

        <div className="my-2 w-px bg-gray-200" />

        <div className="flex items-center px-3 py-2">
          <span className="mr-2 hidden text-sm text-gray-500 sm:block">Día</span>
          <input
            type="number"
            min={1}
            max={maxDay}
            className="w-16 appearance-none bg-transparent px-2 py-2 text-center text-gray-800 outline-none focus:ring-0"
            value={safeDay}
            onChange={(e) => handleDayChange(Number(e.target.value))}
            aria-label="Seleccionar día"
          />
        </div>

        <div className="my-2 w-px bg-gray-200" />

        <div className="flex items-center px-2 py-1">
          <button
            onClick={onGoToSelectedDate}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Ir
          </button>
        </div>
      </div>
    </div>
  );
};

