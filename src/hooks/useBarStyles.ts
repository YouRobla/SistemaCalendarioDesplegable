import { useState, useCallback } from 'react';

/**
 * Interfaz para una barra individual en el calendario
 */
interface Bar {
  id: string;
  room: number;
  start: number;
  end: number;
}

/**
 * Hook para manejar barras continuas en el calendario.
 * Permite crear barras arrastrando y seleccionando celdas.
 * Cada barra es un componente individual con lógica independiente.
 */
export const useBarStyles = () => {
  // Estado de las barras creadas
  const [bars, setBars] = useState<Bar[]>([]);
  
  // Estado de la selección activa
  const [selection, setSelection] = useState<{
    active: boolean;
    room: number | null;
    start: number | null;
    end: number | null;
  }>({ active: false, room: null, start: null, end: null });

  /**
   * Inicia una nueva selección de barra
   * @param room - Índice de la habitación
   * @param day - Índice del día
   */
  const startSelection = useCallback((room: number, day: number) => {
    setSelection({ active: true, room, start: day, end: day });
  }, []);

  const updateSelection = useCallback((_room: number, day: number) => {
    if (!selection.active) return;
    setSelection(prev => ({ ...prev, end: day }));
  }, [selection.active]);

  /**
   * Finaliza la selección y crea la barra
   */
  const endSelection = useCallback(() => {
    if (!selection.active || selection.room === null || selection.start === null || selection.end === null) {
      setSelection({ active: false, room: null, start: null, end: null });
      return;
    }

    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    
    const newBar: Bar = {
      id: `bar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      room: selection.room,
      start,
      end,
    };
    
    setBars(prev => [...prev, newBar]);
    setSelection({ active: false, room: null, start: null, end: null });
  }, [selection]);

  /**
   * Determina la posición de una celda dentro de una barra
   * @param room - Índice de la habitación
   * @param day - Índice del día
   * @returns Posición de la celda: 'head', 'body', 'tail', 'single' o null
   */
  const getBarPosition = useCallback((room: number, day: number) => {
    // Verificar selección activa
    if (selection.active && selection.room === room && selection.start && selection.end) {
      const start = Math.min(selection.start, selection.end);
      const end = Math.max(selection.start, selection.end);
      if (day >= start && day <= end) {
        if (start === end) return 'single';
        if (day === start) return 'head';
        if (day === end) return 'tail';
        return 'body';
      }
    }

    // Verificar barras existentes
    const bar = bars.find(b => b.room === room && day >= b.start && day <= b.end);
    if (!bar) return null;

    if (bar.start === bar.end) return 'single';
    if (day === bar.start) return 'head';
    if (day === bar.end) return 'tail';
    return 'body';
  }, [bars, selection]);

  /**
   * Obtiene información completa de una barra para un segmento específico
   * @param room - Índice de la habitación
   * @param day - Índice del día
   * @returns Información de la barra o null si no hay barra
   */
  const getBarInfo = useCallback((room: number, day: number) => {
    const position = getBarPosition(room, day);
    if (!position) return null;

    // Verificar si esta celda está en la selección activa
    const isInActiveSelection = selection.active && 
      selection.room === room && 
      selection.start !== null && 
      selection.end !== null &&
      day >= Math.min(selection.start, selection.end) &&
      day <= Math.max(selection.start, selection.end);

    return {
      position: position as 'head' | 'body' | 'tail' | 'single',
      isActive: isInActiveSelection,
      barId: bars.find(b => b.room === room && day >= b.start && day <= b.end)?.id
    };
  }, [getBarPosition, selection, bars]);

  const getCellClasses = useCallback((room: number, day: number) => {
    const base = 'relative h-12 cursor-crosshair select-none overflow-hidden';
    return getBarPosition(room, day) ? base : `${base} hover:bg-slate-50`;
  }, [getBarPosition]);

  return {
    getCellClasses,
    getBarInfo,
    startSelection,
    updateSelection,
    endSelection,
    bars
  };
};
