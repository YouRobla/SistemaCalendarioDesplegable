import { memo } from "react";
import { BarSegment } from "./BarSegment";

interface DaysCalendarProps {
  rowIndex: number;
  dayIndex: number;
  cellClasses: string;
  barInfo: {
    position: 'head' | 'body' | 'tail' | 'single';
    isActive: boolean;
    barId?: string;
  } | null;
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
  barInfo,
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
      {barInfo && (
        <BarSegment
          roomIndex={rowIndex}
          dayIndex={dayIndex}
          isActive={barInfo.isActive}
          position={barInfo.position}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseUp={onMouseUp}
        />
      )}
    </td>
  );
});
