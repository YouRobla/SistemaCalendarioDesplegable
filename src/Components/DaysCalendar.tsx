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
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onMouseDown(rowIndex, dayIndex);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      onMouseEnter(rowIndex, dayIndex);
    }
  };

  return (
    <div
      className={cellClasses}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={onMouseUp}
      style={{
        outline: 'none',
        boxShadow: 'none',
      }}
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.dayIndex === nextProps.dayIndex &&
    prevProps.cellClasses === nextProps.cellClasses
  );
});
