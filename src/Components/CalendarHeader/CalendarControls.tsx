interface CalendarControlsProps {
  months: string[];
  selectedMonth: number;
  selectedDay: number;
  onMonthChange: (month: number) => void;
  onDayChange: (day: number) => void;
  onScrollToToday: () => void;
  onGoToSelectedDate: () => void;
}

export const CalendarControls = ({
  months,
  selectedMonth,
  selectedDay,
  onMonthChange,
  onDayChange,
  onScrollToToday,
  onGoToSelectedDate,
}: CalendarControlsProps) => {
  return (
    <div className="mt-4 flex flex-wrap justify-between items-center gap-4 px-2">
      {/* Botón Ir al día actual - Mejorado */}
      <button
        onClick={onScrollToToday}
        className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 font-semibold"
      >
          Hoy
      </button>

      {/* Selector de fecha - Mejorado */}
      <div className="flex items-center gap-3 backdrop-blur-sm p-3 rounded-xl shadow-md border-2 border-gray-200/50 hover:border-indigo-300 transition-all duration-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Mes:</label>
          <select
            className="border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-gray-700 font-medium bg-white cursor-pointer transition-all outline-none"
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Día:</label>
          <input
            type="number"
            min="1"
            max="31"
            className="border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 w-20 text-gray-700 font-medium text-center bg-white transition-all outline-none"
            value={selectedDay}
            onChange={(e) => onDayChange(Number(e.target.value))}
          />
        </div>

        <button
          onClick={onGoToSelectedDate}
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 font-semibold"
        >
          Ir
        </button>
      </div>
    </div>
  );
};
