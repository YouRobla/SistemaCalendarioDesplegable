import { useEffect, useMemo, useRef, useState } from "react";
import { useCalendarScroll } from "../hooks/useCalendarScroll";
import { months, generateAllDays } from "../utils/calendarHelpers";
import { CalendarTitle } from "./CalendarHeader/CalendarTitle";
import { CalendarControls } from "./CalendarHeader/CalendarControls";
import { HotelSelect } from "./CalendarHeader/HotelSelect";
import { CalendarTable } from "./CalendarTable/CalendarTable";
import { useQuery } from "@tanstack/react-query";
import { getHotelRooms } from "../api/HotelRooms";
import { getHotels } from "../api/Hotels";


/**
 * Calendario anual desplazable (2 años), con encabezado pegajoso y controles.
 */
export const YearlyScrollableCalendar = () => {
  const today = useMemo(() => new Date(), []);
  const startYear = today.getFullYear();

  // Generar todos los días del período (2 años desde startYear)
  const allDays = useMemo(() => generateAllDays(startYear), [startYear]);
  
  // Estado para hotel seleccionado
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);

  // Obtener hoteles con TanStack Query (cache optimizado)
  const { 
    data: hotels = [], 
    isLoading: isLoadingHotels, 
    isError: isErrorHotels 
  } = useQuery({
    queryKey: ['hotels'],
    queryFn: getHotels,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No refetch si ya hay datos en cache
  });

  // Obtener habitaciones con TanStack Query (cache optimizado)
  const { 
    data: HotelRooms = [], 
    isLoading: isLoadingRooms, 
    isError: isErrorRooms
  } = useQuery({
    queryKey: ['HotelRooms', selectedHotelId],
    queryFn: () => getHotelRooms(selectedHotelId),
    enabled: selectedHotelId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutos - las habitaciones pueden cambiar más frecuentemente
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch si los datos están stale
  });

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

  // Scroll automático al día de hoy cuando se selecciona un hotel
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (selectedHotelId !== null && !isLoadingRooms && HotelRooms.length > 0 && !hasScrolledRef.current) {
      scrollToToday();
      hasScrolledRef.current = true;
    }
  }, [selectedHotelId, isLoadingRooms, HotelRooms.length, scrollToToday]);
  
  // Reset cuando cambia de hotel
  useEffect(() => {
    hasScrolledRef.current = false;
  }, [selectedHotelId]);

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

      {/* Sección de selección de hotel */}
      <div className="mb-4">
        <div className="flex items-center gap-4 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Escoger hotel:
          </label>
          {isLoadingHotels ? (
            <div className="text-sm text-gray-500">Cargando hoteles...</div>
          ) : isErrorHotels ? (
            <div className="text-sm text-red-500">Error al cargar hoteles</div>
          ) : (
            <HotelSelect
              hotels={hotels}
              value={selectedHotelId}
              onChange={setSelectedHotelId}
            />
          )}
        </div>
      </div>

      {/* Tabla del calendario */}
      {isLoadingRooms ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando habitaciones...</p>
          </div>
        </div>
      ) : isErrorRooms ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="text-center text-red-500">
            <p className="font-semibold">Error al cargar habitaciones</p>
            <p className="text-sm mt-2">Por favor, intente nuevamente</p>
          </div>
        </div>
      ) : selectedHotelId === null ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="text-center text-gray-500">
            <p className="font-semibold">Seleccione un hotel</p>
            <p className="text-sm mt-2">Por favor, seleccione un hotel para ver las habitaciones</p>
          </div>
        </div>
      ) : (
        <CalendarTable
          containerRef={containerRef}
          allDays={allDays}
          today={today}
          rooms={HotelRooms}
        />
      )}
    </div>
  );
};
