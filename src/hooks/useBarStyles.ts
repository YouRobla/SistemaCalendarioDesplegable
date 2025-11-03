import { useRef, useState, useCallback, useEffect } from "react";

interface Bar {
  id: string;
  room: number;
  start: number;
  end: number;
}

export const useBarStyles = () => {
  const [, trigger] = useState({});
  const barsByRoom = useRef<Map<number, Bar[]>>(new Map());
  const selectionRef = useRef({
    active: false,
    room: null as number | null,
    start: null as number | null,
    end: null as number | null,
  });

  const forceRender = useCallback(() => {
    requestAnimationFrame(() => trigger({}));
  }, []);

  // ✅ NUEVA FUNCIÓN: Verificar si una celda está bloqueada
  const isCellBlocked = useCallback((room: number, day: number): boolean => {
    const bars = barsByRoom.current.get(room) || [];
    return bars.some(bar => day >= bar.start && day <= bar.end);
  }, []);

  // ✅ MODIFICADO: Verificar si se puede iniciar selección
  const startSelection = useCallback((room: number, day: number) => {
    // No permitir iniciar en celda bloqueada
    if (isCellBlocked(room, day)) {
      return;
    }
    
    selectionRef.current = { active: true, room, start: day, end: day };
    forceRender();
  }, [forceRender, isCellBlocked]);

  // ✅ MODIFICADO: No permitir extender sobre celdas bloqueadas
  const updateSelection = useCallback((room: number, day: number) => {
    const s = selectionRef.current;
    if (!s.active || s.room !== room) return;
    if (s.end === day) return;
    
    // Verificar si el rango contiene celdas bloqueadas
    const start = Math.min(s.start!, day);
    const end = Math.max(s.start!, day);
    
    // Verificar cada día en el rango
    for (let d = start; d <= end; d++) {
      if (isCellBlocked(room, d)) {
        // Si encuentra una celda bloqueada, cancelar la selección
        return;
      }
    }
    
    s.end = day;
    forceRender();
  }, [forceRender, isCellBlocked]);

  const endSelection = useCallback(() => {
    const s = selectionRef.current;
    
    if (!s.active || s.room === null || s.start === null || s.end === null) {
      selectionRef.current = { active: false, room: null, start: null, end: null };
      forceRender();
      return;
    }

    const start = Math.min(s.start, s.end);
    const end = Math.max(s.start, s.end);

    // ✅ Verificación final antes de crear la barra
    for (let d = start; d <= end; d++) {
      if (isCellBlocked(s.room, d)) {
        // Si hay celdas bloqueadas, cancelar
        selectionRef.current = { active: false, room: null, start: null, end: null };
        forceRender();
        return;
      }
    }

    const newBar: Bar = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      room: s.room,
      start,
      end,
    };

    const roomBars = barsByRoom.current.get(s.room) || [];
    barsByRoom.current.set(s.room, [...roomBars, newBar]);

    selectionRef.current = { active: false, room: null, start: null, end: null };
    forceRender();
  }, [forceRender, isCellBlocked]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (selectionRef.current.active) {
        endSelection();
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [endSelection]);

  // ✅ MODIFICADO: getCellClasses con estado bloqueado
  const getCellClasses = useCallback((room: number, day: number) => {
    const s = selectionRef.current;
    const bars = barsByRoom.current.get(room) || [];
    
    // Verificar si está bloqueada (tiene una barra persistente)
    const isBlocked = bars.some(b => day >= b.start && day <= b.end);
    
    // Verificar posición en barras
    let isInsideBar = false;
    let isBarStart = false;
    let isBarEnd = false;
    
    // Solo verificar barras persistentes para los estilos
    for (const b of bars) {
      if (day >= b.start && day <= b.end) {
        if (b.start === b.end) {
          isBarStart = true;
          isBarEnd = true;
        } else if (day === b.start) {
          isBarStart = true;
        } else if (day === b.end) {
          isBarEnd = true;
        } else {
          isInsideBar = true;
        }
        break;
      }
    }
    
    // Verificar selección activa (solo si no está bloqueada)
    const isInActiveSelection = !isBlocked && 
      s.active && 
      s.room === room && 
      s.start !== null && 
      s.end !== null &&
      day >= Math.min(s.start, s.end) && 
      day <= Math.max(s.start, s.end);
    
    if (isInActiveSelection) {
      const start = Math.min(s.start!, s.end!);
      const end = Math.max(s.start!, s.end!);
      
      if (day >= start && day <= end) {
        if (start === end) {
          isBarStart = true;
          isBarEnd = true;
        } else if (day === start) {
          isBarStart = true;
        } else if (day === end) {
          isBarEnd = true;
        } else {
          isInsideBar = true;
        }
      }
    }
    
    // Calcular bordes
    let borderClasses;
    if (isInsideBar) {
      borderClasses = 'border-t border-b border-gray-100';
    } else if (isBarStart && !isBarEnd) {
      borderClasses = 'border-l border-t border-b border-gray-100';
    } else if (isBarEnd && !isBarStart) {
      borderClasses = 'border-r border-t border-b border-gray-100';
    } else {
      borderClasses = 'border border-gray-100';
    }
    
    // ✅ NUEVO: Estilos para celdas bloqueadas
    if (isBlocked) {
      return `relative h-20 select-none bg-gray-100 ${borderClasses} cursor-not-allowed opacity-60`;
    }
    
    // Celdas libres
    const hoverClasses = isInActiveSelection
      ? 'cursor-pointer' 
      : 'hover:bg-blue-50/40 hover:border-blue-200 cursor-crosshair';
    
    return `relative h-20 select-none transition-all duration-150 bg-white ${borderClasses} ${hoverClasses}`;
  }, []);

  const getBarsForRoom = useCallback((room: number) => {
    const s = selectionRef.current;
    const bars: Array<{ start: number; end: number; isActive: boolean }> = [];
    
    // Barras persistentes (bloqueadas)
    const roomBars = barsByRoom.current.get(room) || [];
    for (const bar of roomBars) {
      bars.push({ start: bar.start, end: bar.end, isActive: false });
    }
    
    // Selección activa (solo si no hay celdas bloqueadas en el rango)
    if (s.active && s.room === room && s.start !== null && s.end !== null) {
      const start = Math.min(s.start, s.end);
      const end = Math.max(s.start, s.end);
      
      // Verificar que no haya celdas bloqueadas
      let hasBlocked = false;
      for (let d = start; d <= end; d++) {
        if (roomBars.some(b => d >= b.start && d <= b.end)) {
          hasBlocked = true;
          break;
        }
      }
      
      // Solo agregar si no hay bloqueos
      if (!hasBlocked) {
        bars.push({
          start,
          end,
          isActive: true,
        });
      }
    }
    
    return bars;
  }, []);

  return {
    getCellClasses,
    getBarsForRoom,
    startSelection,
    updateSelection,
    endSelection,
    isCellBlocked, // ✅ Exportar por si lo necesitas
  };
};