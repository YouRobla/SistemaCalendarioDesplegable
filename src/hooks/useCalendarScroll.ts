import { useEffect, useRef, useState } from "react";
import type { CalendarDay } from "../utils/calendarHelpers";

/**
 * Hook para manejar el scroll horizontal del calendario y
 * mantener sincronizado el mes/año visibles.
 */
export const useCalendarScroll = (allDays: CalendarDay[], today: Date) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleMonth, setVisibleMonth] = useState("");
  const [visibleYear, setVisibleYear] = useState(0);
  const tickingRef = useRef(false); // throttle con requestAnimationFrame
  const COLUMN_WIDTH = 85; // ancho fijo por día (px)

  // Actualiza el mes visible al hacer scroll
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(() => {
          const scrollLeft = container.scrollLeft;
          // Usar la PRIMERA columna completamente visible para decidir el mes visible
          const firstVisibleIndex = Math.floor(scrollLeft / COLUMN_WIDTH);
          const index = Math.max(0, Math.min(firstVisibleIndex, allDays.length - 1));
          const monthData = allDays[index] || allDays[0];

          if (monthData) {
            setVisibleMonth((prev) => (prev !== monthData.monthName ? monthData.monthName : prev));
            setVisibleYear((prev) => (prev !== monthData.year ? monthData.year : prev));
          }

          tickingRef.current = false;
        });
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container?.removeEventListener("scroll", onScroll);
    };
  }, [allDays]);

  // Posicionarse automáticamente en el día actual SOLO al montar
  useEffect(() => {
    if (allDays.length === 0) return;
    
    const initializeScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const todayIndex = allDays.findIndex(
        (d) =>
          d.day === today.getDate() &&
          d.month === today.getMonth() &&
          d.year === today.getFullYear()
      );

      if (todayIndex !== -1) {
        const scrollX = todayIndex * COLUMN_WIDTH;
        container.scrollLeft = scrollX;
        
        // Actualizar inmediatamente el estado visible
        const monthData = allDays[todayIndex];
        if (monthData) {
          setVisibleMonth(monthData.monthName);
          setVisibleYear(monthData.year);
        }
      }
    };

    // Reducir delay para que cargue más rápido
    const timeoutId = setTimeout(initializeScroll, 50);
    return () => clearTimeout(timeoutId);
  }, [allDays, today]);

  const scrollToToday = () => {
    const container = containerRef.current;
    if (!container) return;

    const todayIndex = allDays.findIndex(
      (d) =>
        d.day === today.getDate() &&
        d.month === today.getMonth() &&
        d.year === today.getFullYear()
    );

    if (todayIndex !== -1) {
      const scrollX = todayIndex * COLUMN_WIDTH;
      container.scrollTo({ left: scrollX, behavior: "smooth" });
      
      setTimeout(() => {
        const monthData = allDays[todayIndex];
        if (monthData) {
          setVisibleMonth(monthData.monthName);
          setVisibleYear(monthData.year);
        }
      }, 300);
    }
  };

  const scrollToDate = (month: number, day: number, year: number) => {
    const container = containerRef.current;
    if (!container) return;

    const selectedDate = allDays.find(
      (d) => d.month === month && d.day === day && d.year === year
    );

    if (selectedDate) {
      const index = allDays.indexOf(selectedDate);
      const scrollX = index * COLUMN_WIDTH;
      container.scrollTo({ left: scrollX, behavior: "smooth" });
      // Actualizar el encabezado luego del desplazamiento
      setTimeout(() => {
        setVisibleMonth(selectedDate.monthName);
        setVisibleYear(selectedDate.year);
      }, 250);
    }
  };

  return {
    containerRef,
    visibleMonth,
    visibleYear,
    setVisibleMonth,
    setVisibleYear,
    scrollToToday,
    scrollToDate
  };
};
