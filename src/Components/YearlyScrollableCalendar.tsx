import { useEffect, useMemo, useState } from "react";
import { useCalendarScroll } from "../hooks/useCalendarScroll";
import { months, generateAllDays } from "../utils/calendarHelpers";
import { CalendarTitle } from "./CalendarHeader/CalendarTitle";
import { CalendarControls } from "./CalendarHeader/CalendarControls";
import { CalendarTable } from "./CalendarTable/CalendarTable";

/**
 * Calendario anual desplazable (2 años), con encabezado pegajoso y controles.
 */
export const YearlyScrollableCalendar = () => {
  const today = useMemo(() => new Date(), []);
  const startYear = today.getFullYear();

  // Generar todos los días del período (2 años desde startYear)
  const allDays = useMemo(() => generateAllDays(startYear), [startYear]);

  // Hook personalizado para manejar el scroll y el mes/año visibles
  const {
    containerRef,
    visibleMonth,
    visibleYear,
    setVisibleMonth,
    setVisibleYear,
    scrollToToday,
    scrollToDate,
  } = useCalendarScroll(allDays, today);

  // Estados para los controles (fecha seleccionada)
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Inicializar encabezado visible al montar
  useEffect(() => {
    setVisibleMonth(months[today.getMonth()]);
    setVisibleYear(startYear);
  }, [setVisibleMonth, setVisibleYear, startYear, today]);

  // Asegurar que el día seleccionado exista en el mes elegido
  useEffect(() => {
    const maxDay = new Date(startYear, selectedMonth + 1, 0).getDate();
    if (selectedDay > maxDay) setSelectedDay(maxDay);
  }, [selectedMonth, selectedDay, startYear]);

  const goToSelectedDate = () => {
    scrollToDate(selectedMonth, selectedDay, startYear);
  };

  // Lista parametrizable de habitaciones (puede venir de props/estado remoto)
  const rooms = [
    "Habitación 1",
    "Habitación 2",
    "Habitación 3",
    "Habitación 4",
    "Habitación 5",
    "Habitación 6",
    "Habitación 7",
  ];

  return (
    <div className="p-8 bg-linear-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Encabezado con mes visible y controles */}
      <div className="sticky top-0 z-30 mb-3">
        <CalendarTitle visibleMonth={visibleMonth} visibleYear={visibleYear} />

        <CalendarControls
          months={months}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          year={startYear}
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
        rooms={rooms}
      />
    </div>
  );
};
