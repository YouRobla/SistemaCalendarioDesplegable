export const MothCalendar = ({
    index,
    day,
    weekday,
    monthName,
    year,
    today,
  }: {
    index: number;
    day: number;
    weekday: string;
    monthName: string;
    year: number;
    today: Date;
  }) => {
    // Comparación más robusta usando el mes numérico
    const todayMonth = today.getMonth(); // 0-11
    const months = [
      "enero", "febrero", "marzo", "abril",
      "mayo", "junio", "julio", "agosto",
      "septiembre", "octubre", "noviembre", "diciembre",
    ];
    
    const isToday =
      day === today.getDate() &&
      monthName.toLowerCase() === months[todayMonth] &&
      year === today.getFullYear();
  
    // Determinar clase de fondo con mejor contraste para el día actual
    const bgClass = isToday
      ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105 ring-2 ring-blue-300"
      : index % 2 === 0
      ? "bg-white"
      : "bg-gray-50";
  
    return (
      <th
        key={index}
        className={`p-3 min-w-[85px] transition-all duration-200 ${bgClass} hover:bg-blue-100 ${isToday ? 'hover:from-blue-600 hover:to-indigo-700' : ''}`}
      >
        <div className={`font-medium ${isToday ? 'text-white' : 'text-gray-700'}`}>
          <span className={`text-lg font-bold ${isToday ? 'text-white' : ''}`}>{day}</span>
          <span className={`block text-xs font-semibold mt-1 ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
            {weekday}
          </span>
          {isToday && (
            <span className="block text-[10px] text-blue-200 font-medium mt-0.5">
              HOY
            </span>
          )}
          {!isToday && (
            <span className="block text-[10px] text-gray-400 mt-0.5">
              {monthName.slice(0, 3)} {year}
            </span>
          )}
        </div>
      </th>
    );
  };
  