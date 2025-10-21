import { memo } from "react";

interface DaysCalendarProps {
  rowIndex: number;
  dayIndex: number;
  cellClasses: string;
  barInnerClasses: string;
  onMouseDown: (rowIndex: number, dayIndex: number) => void;
  onMouseEnter: (rowIndex: number, dayIndex: number) => void;
  onMouseUp: () => void;
}

/**
 * Celda del calendario con soporte para barras continuas dinámicas.
 */
export const DaysCalendar = memo(function DaysCalendar({
  rowIndex,
  dayIndex,
  cellClasses,
  barInnerClasses,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: DaysCalendarProps) {
  const handleMouseDown = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    onMouseDown(rowIndex, dayIndex);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLTableCellElement>) => {
    if (event.buttons === 1) {
      onMouseEnter(rowIndex, dayIndex);
    }
  };

  return (
    <td
      className={cellClasses}
      role="gridcell"
      aria-colindex={dayIndex + 2}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={onMouseUp}
    >
      {barInnerClasses && (
        <div className={barInnerClasses} />
      )}
    </td>
  );
});
