import { useEffect, useMemo, useState } from "react";
import { useCalendarScroll } from "../hooks/useCalendarScroll";
import { months, generateAllDays } from "../utils/calendarHelpers";
import { CalendarTitle } from "./CalendarHeader/CalendarTitle";
import { CalendarControls } from "./CalendarHeader/CalendarControls";
import { CalendarTable } from "./CalendarTable/CalendarTable";
import { useQuery } from "@tanstack/react-query";
import { getHotelRooms } from "../api/HotelRooms";


/**
 * Calendario anual desplazable (2 años), con encabezado pegajoso y controles.
 */
export const YearlyScrollableCalendar = () => {
  const today = useMemo(() => new Date(), []);
  const startYear = today.getFullYear();

  // Generar todos los días del período (2 años desde startYear)
  const allDays = useMemo(() => generateAllDays(startYear), [startYear]);
  const { data: HotelRooms = [] } = useQuery({
    queryKey: ['HotelRooms'],
    queryFn: getHotelRooms,
  });

  // 📊 Log del número de habitaciones recibidas
  useEffect(() => {
    if (HotelRooms && HotelRooms.length > 0) {
      console.log(`🏨 Total de habitaciones cargadas: ${HotelRooms.length}`);
      console.log('📋 Lista de habitaciones:', HotelRooms.map(room => ({
        id: room.id,
        name: room.name
      })));
    } else if (HotelRooms && HotelRooms.length === 0) {
      console.warn('⚠️ No se recibieron habitaciones del backend (array vacío)');
    }
  }, [HotelRooms]);

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
    // Inicializar directamente con el mes actual para evitar cambios innecesarios
    const currentMonth = months[today.getMonth()];
    setVisibleMonth(currentMonth);
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


  return (
    <div className="p-8 bg-linear-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Encabezado con mes visible y controles */}
      <div className="sticky top-0 z-30 mb-3">
        <div className="flex items-center justify-between bg-linear-to-r from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-100/50 p-5">
          {/* Título */}
          <CalendarTitle visibleMonth={visibleMonth} visibleYear={visibleYear} />

          {/* Controles al mismo nivel */}
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
      </div>

      {/* Tabla del calendario */}
      <CalendarTable
        containerRef={containerRef}
        allDays={allDays}
        today={today}
        rooms={HotelRooms}
      />
    </div>
  );
};
