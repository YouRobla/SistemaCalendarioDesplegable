import { useState, useCallback } from 'react';

interface Bar {
  id: string;
  room: number;
  start: number;
  end: number;
}

export const useBarStyles = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selection, setSelection] = useState<{
    active: boolean;
    room: number | null;
    start: number | null;
    end: number | null;
  }>({ active: false, room: null, start: null, end: null });

  const startSelection = useCallback((room: number, day: number) => {
    setSelection({ active: true, room, start: day, end: day });
  }, []);

  const updateSelection = useCallback((_room: number, day: number) => {
    if (!selection.active) return;
    setSelection(prev => ({ ...prev, end: day }));
  }, [selection.active]);

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

  const getBarPosition = useCallback((room: number, day: number) => {
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

    const bar = bars.find(b => b.room === room && day >= b.start && day <= b.end);
    if (!bar) return null;

    if (bar.start === bar.end) return 'single';
    if (day === bar.start) return 'head';
    if (day === bar.end) return 'tail';
    return 'body';
  }, [bars, selection]);

  const getBarInfo = useCallback((room: number, day: number) => {
    const position = getBarPosition(room, day);
    if (!position) return null;

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
    const hasBar = getBarPosition(room, day);
    
    if (hasBar) {
      return `${base} bg-slate-50/30 border-t border-b border-gray-100`;
    }
    
    return `${base} border border-gray-100 hover:bg-slate-50 transition-colors duration-150`;
  }, [getBarPosition]);

  return {
    getCellClasses,
    getBarInfo,
    startSelection,
    updateSelection,
    endSelection
  };
};
