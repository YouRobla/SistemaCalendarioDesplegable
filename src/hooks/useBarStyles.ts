import { useState, useCallback } from 'react';

export interface BarData {
  id: string;
  roomIndex: number;
  startDay: number;
  endDay: number;
}

export interface SelectionState {
  isSelecting: boolean;
  startRoom: number | null;
  startDay: number | null;
  currentRoom: number | null;
  currentDay: number | null;
}

/**
 * Hook para manejar barras continuas dinámicas en el calendario.
 * Permite crear barras arrastrando y seleccionando celdas.
 */
export const useBarStyles = () => {
  const [bars, setBars] = useState<BarData[]>([]);
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startRoom: null,
    startDay: null,
    currentRoom: null,
    currentDay: null,
  });

  /**
   * Inicia la selección de una barra
   */
  const startSelection = useCallback((roomIndex: number, dayIndex: number) => {
    setSelection({
      isSelecting: true,
      startRoom: roomIndex,
      startDay: dayIndex,
      currentRoom: roomIndex,
      currentDay: dayIndex,
    });
  }, []);

  /**
   * Actualiza la selección mientras se arrastra
   */
  const updateSelection = useCallback((roomIndex: number, dayIndex: number) => {
    if (!selection.isSelecting) return;
    
    setSelection(prev => ({
      ...prev,
      currentRoom: roomIndex,
      currentDay: dayIndex,
    }));
  }, [selection.isSelecting]);

  /**
   * Finaliza la selección y crea la barra
   */
  const endSelection = useCallback(() => {
    if (!selection.isSelecting) {
      setSelection({
        isSelecting: false,
        startRoom: null,
        startDay: null,
        currentRoom: null,
        currentDay: null,
      });
      return;
    }

    // Solo crear barra si está en la misma fila y tenemos valores válidos
    if (selection.startRoom === selection.currentRoom && 
        selection.startDay !== null && 
        selection.currentDay !== null) {
      const startDay = Math.min(selection.startDay, selection.currentDay);
      const endDay = Math.max(selection.startDay, selection.currentDay);
      
      const newBar: BarData = {
        id: `bar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomIndex: selection.startRoom!,
        startDay,
        endDay,
      };

      setBars(prev => [...prev, newBar]);
    }

    setSelection({
      isSelecting: false,
      startRoom: null,
      startDay: null,
      currentRoom: null,
      currentDay: null,
    });
  }, [selection]);

  /**
   * Obtiene la posición de una celda dentro de una barra
   */
  const getBarPosition = useCallback((roomIndex: number, dayIndex: number): 'head' | 'body' | 'tail' | 'single' | null => {
    // Verificar selección activa
    if (selection.isSelecting && 
        selection.startRoom === roomIndex && 
        selection.startDay !== null && 
        selection.currentDay !== null) {
      const startDay = Math.min(selection.startDay, selection.currentDay);
      const endDay = Math.max(selection.startDay, selection.currentDay);
      
      if (dayIndex >= startDay && dayIndex <= endDay) {
        if (startDay === endDay) return 'single';
        if (dayIndex === startDay) return 'head';
        if (dayIndex === endDay) return 'tail';
        return 'body';
      }
    }

    // Verificar barras existentes
    const bar = bars.find(b => 
      b.roomIndex === roomIndex && 
      dayIndex >= b.startDay && 
      dayIndex <= b.endDay
    );

    if (!bar) return null;

    if (bar.startDay === bar.endDay) return 'single';
    if (dayIndex === bar.startDay) return 'head';
    if (dayIndex === bar.endDay) return 'tail';
    return 'body';
  }, [bars, selection]);

  /**
   * Obtiene las clases CSS para una celda según su posición en la barra
   */
  const getCellClasses = useCallback((roomIndex: number, dayIndex: number): string => {
    const baseClasses = 'relative h-12 cursor-crosshair select-none overflow-hidden transition-all duration-200';
    const barPosition = getBarPosition(roomIndex, dayIndex);
    
    if (!barPosition) {
      return `${baseClasses} hover:bg-slate-100`;
    }

    // Para barras, solo aplicar las clases base
    return `${baseClasses}`;
  }, [getBarPosition]);

  /**
   * Obtiene las clases para el elemento interno de la barra
   */
  const getBarInnerClasses = useCallback((roomIndex: number, dayIndex: number): string => {
    const barPosition = getBarPosition(roomIndex, dayIndex);
    
    if (!barPosition) {
      return '';
    }

    // Colores constantes sin gradientes
    const colorClass = selection.isSelecting ? 'bg-blue-500' : 'bg-green-500';
    
    // Estilos según la posición en la barra
    const positionClasses = {
      head: 'rounded-l-full', // Solo borde izquierdo redondeado
      body: 'rounded-none', // Sin bordes redondeados
      tail: 'rounded-r-full', // Solo borde derecho redondeado
      single: 'rounded-full' // Todos los bordes redondeados
    };

    // Posicionamiento con separación real - no usar inset-0
    const positioningClasses = 'absolute top-2 bottom-2 left-0 right-0'; // Separación vertical real
    
    // Efectos visuales mejorados
    const visualEffects = 'shadow-sm transition-all duration-200 hover:shadow-md';
    
    return `${positioningClasses} ${colorClass} ${positionClasses[barPosition]} ${visualEffects}`;
  }, [getBarPosition, selection.isSelecting]);

  return {
    getCellClasses,
    getBarInnerClasses,
    startSelection,
    updateSelection,
    endSelection
  };
};
