import { memo } from "react";

interface DaysCalendarProps {
  rowIndex: number;
  dayIndex: number;
  cellClasses: string;
  onMouseDown: (rowIndex: number, dayIndex: number) => void;
  onMouseEnter: (rowIndex: number, dayIndex: number) => void;
  onMouseUp: () => void;
}

export const DaysCalendar = memo(function DaysCalendar({
  rowIndex,
  dayIndex,
  cellClasses,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: DaysCalendarProps) {
  return (
    <div
      className={cellClasses} 
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(rowIndex, dayIndex);
      }}
      onMouseEnter={(e) => {
        if (e.buttons === 1) {
          onMouseEnter(rowIndex, dayIndex);
        }
      }}
      onMouseUp={onMouseUp}
    />
  );
});

// ✅ Comparación correcta que IGNORA las funciones
DaysCalendar.displayName = 'DaysCalendar';