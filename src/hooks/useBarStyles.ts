import { useRef, useState, useCallback, useEffect } from "react";

interface Bar {
  id: string;
  room: number;
  start: number;
  end: number;
}

export const useBarStyles = () => {
  const [, trigger] = useState({});
  const lastFrameRef = useRef<number>(0);

  const forceRender = useCallback(() => {
    const now = performance.now();
    if (now - lastFrameRef.current < 16) return;
    lastFrameRef.current = now;
    trigger({});
  }, []);

  const barsByRoom = useRef<Map<number, Bar[]>>(new Map());
  const selectionRef = useRef({
    active: false,
    room: null as number | null,
    start: null as number | null,
    end: null as number | null,
  });

  const classCache = useRef<Map<string, string>>(new Map());

  const startSelection = useCallback((room: number, day: number) => {
    selectionRef.current = { active: true, room, start: day, end: day };
    classCache.current.clear();
    forceRender();
  }, [forceRender]);

  const updateSelection = useCallback((room: number, day: number) => {
    const s = selectionRef.current;
    if (!s.active || s.room !== room) return;
    s.end = day;
    classCache.current.clear();
    forceRender();
  }, [forceRender]);

  const endSelection = useCallback(() => {
    const s = selectionRef.current;
    
    if (!s.active || s.room === null || s.start === null || s.end === null) {
      selectionRef.current = { active: false, room: null, start: null, end: null };
      forceRender();
      return;
    }

    const start = Math.min(s.start, s.end);
    const end = Math.max(s.start, s.end);

    const newBar: Bar = {
      id: `bar-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room: s.room,
      start,
      end,
    };

    const roomBars = barsByRoom.current.get(s.room) || [];
    roomBars.push(newBar);
    barsByRoom.current.set(s.room, roomBars);

    selectionRef.current = { active: false, room: null, start: null, end: null };
    classCache.current.clear();
    requestAnimationFrame(() => forceRender());
  }, [forceRender]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (selectionRef.current.active) {
        endSelection();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [endSelection]);

  const getBarPosition = useCallback((room: number, day: number) => {
    const s = selectionRef.current;

    // Barra en selección activa
    if (s.active && s.room === room && s.start !== null && s.end !== null) {
      const start = Math.min(s.start, s.end);
      const end = Math.max(s.start, s.end);
      if (day >= start && day <= end) {
        if (start === end) return "single";
        if (day === start) return "head";
        if (day === end) return "tail";
        return "body";
      }
    }

    // Barras persistentes
    const bars = barsByRoom.current.get(room) || [];
    const bar = bars.find((b) => day >= b.start && day <= b.end);
    if (!bar) return null;

    if (bar.start === bar.end) return "single";
    if (day === bar.start) return "head";
    if (day === bar.end) return "tail";
    return "body";
  }, []);

  const getCellClasses = useCallback((room: number, day: number) => {
    const key = `${room}-${day}`;
    if (classCache.current.has(key)) return classCache.current.get(key);

    const base = "relative h-20 select-none transition-all duration-150";
    const barPosition = getBarPosition(room, day);
    const s = selectionRef.current;
    
    const isInActiveSelection = s.active && s.room === room && 
      s.start !== null && s.end !== null &&
      day >= Math.min(s.start, s.end) && day <= Math.max(s.start, s.end);
    
    // Obtener todas las barras que afectan este día
    const bars = barsByRoom.current.get(room) || [];
    
    // Encontrar si este día está dentro de una barra (no en los extremos)
    let isInsideBar = false;
    let isBarStart = false;
    let isBarEnd = false;
    
    // Verificar barras persistentes
    bars.forEach(b => {
      if (day >= b.start && day <= b.end) {
        if (day === b.start && day === b.end) {
          // Barra de un solo día
          isBarStart = true;
          isBarEnd = true;
        } else if (day === b.start) {
          isBarStart = true;
        } else if (day === b.end) {
          isBarEnd = true;
        } else {
          isInsideBar = true;
        }
      }
    });
    
    // Verificar selección activa
    if (isInActiveSelection && s.start !== null && s.end !== null) {
      const start = Math.min(s.start, s.end);
      const end = Math.max(s.start, s.end);
      if (day >= start && day <= end) {
        if (day === start && day === end) {
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
    
    // Si está dentro de una barra (no en extremos), ocultar todos los bordes verticales
    let borderClasses = '';
    if (isInsideBar) {
      // Dentro de la barra: sin bordes verticales, solo top y bottom
      borderClasses = 'border-t border-b border-gray-100';
    } else if (isBarStart && !isBarEnd) {
      // Inicio de barra: mostrar borde izquierdo, ocultar derecho
      borderClasses = 'border-l border-t border-b border-gray-100';
    } else if (isBarEnd && !isBarStart) {
      // Fin de barra: mostrar borde derecho, ocultar izquierdo
      borderClasses = 'border-r border-t border-b border-gray-100';
    } else {
      // Sin barra o barra de un solo día: todos los bordes
      borderClasses = 'border border-gray-100';
    }
    
    let value;
    if (barPosition && !isInActiveSelection) {
      // Celda ocupada
      value = `${base} bg-white ${borderClasses} cursor-pointer`;
    } else {
      // Celda libre
      value = `${base} bg-white ${borderClasses} hover:bg-blue-50/40 hover:border-blue-200 cursor-crosshair`;
    }
    
    classCache.current.set(key, value);
    return value;
  }, [getBarPosition]);

  // Obtener todas las barras completas de una habitación
  const getBarsForRoom = useCallback((room: number) => {
    const s = selectionRef.current;
    const bars: Array<{ start: number; end: number; isActive: boolean }> = [];
    
    // Barras persistentes
    const roomBars = barsByRoom.current.get(room) || [];
    roomBars.forEach(bar => {
      bars.push({
        start: bar.start,
        end: bar.end,
        isActive: false,
      });
    });
    
    // Barra de selección activa
    if (s.active && s.room === room && s.start !== null && s.end !== null) {
      bars.push({
        start: Math.min(s.start, s.end),
        end: Math.max(s.start, s.end),
        isActive: true,
      });
    }
    
    return bars;
  }, []);

  return {
    getCellClasses,
    getBarsForRoom,
    startSelection,
    updateSelection,
    endSelection,
  };
};
