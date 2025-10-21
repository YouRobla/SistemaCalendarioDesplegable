import { useMemo, useState } from "react";
import { useCalendarScroll } from "../hooks/useCalendarScroll";
import { months, generateAllDays } from "../utils/calendarHelpers";
import { CalendarTitle } from "./CalendarHeader/CalendarTitle";
import { CalendarControls } from "./CalendarHeader/CalendarControls";
import { CalendarTable } from "./CalendarTable/CalendarTable";

export const YearlyScrollableCalendar = () => {
  const today = new Date();
  const startYear = today.getFullYear();

  // Generar todos los días
  const allDays = useMemo(() => generateAllDays(startYear), [startYear]);

  // Hook personalizado para manejar el scroll
  const {
    containerRef,
    visibleMonth,
    visibleYear,
    setVisibleMonth,
    setVisibleYear,
    scrollToToday,
    scrollToDate
  } = useCalendarScroll(allDays, today);

  // Estados para los controles
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Inicializar mes visible
  useState(() => {
    setVisibleMonth(months[today.getMonth()]);
    setVisibleYear(startYear);
  });

  const goToSelectedDate = () => {
    scrollToDate(selectedMonth, selectedDay, startYear);
  };

  return (
    <div className="p-8 bg-linear-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Encabezado dinámico con mes visible */}
      <div className="sticky top-0 z-30 mb-3">
        <CalendarTitle visibleMonth={visibleMonth} visibleYear={visibleYear} />
        
        <CalendarControls
          months={months}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          onMonthChange={setSelectedMonth}
          onDayChange={setSelectedDay}
          onScrollToToday={scrollToToday}
          onGoToSelectedDate={goToSelectedDate}
        />
      </div>

      {/* Tabla del calendario */}
      <CalendarTable 
        containerRef={containerRef}
        allDays={allDays}
        today={today}
      />
    </div>
  );
};
