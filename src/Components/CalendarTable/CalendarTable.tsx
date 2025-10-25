import { type RefObject } from "react";
import { DayHeaderCell } from "../DayHeaderCell";
import { DaysCalendar } from "../DaysCalendar";
import type { CalendarDay } from "../../utils/calendarHelpers";
import { useBarStyles } from "../../hooks/useBarStyles";
import type { HotelRoom } from "../../api/HotelRooms";
import "../../styles/calendar.css";

interface CalendarTableProps {
  containerRef: RefObject<HTMLDivElement | null>;
  allDays: CalendarDay[];
  today: Date;
  rooms: HotelRoom[];
}

export const CalendarTable = ({
  containerRef,
  allDays,
  today,
  rooms,
}: CalendarTableProps) => {
  const { 
    getCellClasses, 
    getBarInfo,
    startSelection, 
    updateSelection, 
    endSelection
  } = useBarStyles();

  // Determinar si necesitamos scroll vertical (8 o más filas)
  const needsVerticalScroll = rooms.length >= 8;
  const maxHeight = needsVerticalScroll ? 'max-h-[70vh]' : '';

  return (
    <div
      ref={containerRef}
      className={`calendar-container overflow-x-auto ${needsVerticalScroll ? 'overflow-y-auto' : ''} rounded-2xl border border-gray-100 bg-white shadow-lg ${maxHeight}`}
      style={{ whiteSpace: "nowrap" }}
    >
      <table className="calendar-table min-w-max w-full border-separate border-spacing-0 text-center">
        <thead className={`sticky-header bg-linear-to-r from-blue-50 to-indigo-50 ${needsVerticalScroll ? 'sticky top-0 z-30' : ''}`}>
          <tr>
            <th className="sticky-column sticky left-0 z-40 border-r border-gray-100 bg-white/90 p-3 font-semibold text-gray-700 shadow-sm backdrop-blur-md">
              Habitaciones
            </th>
            {allDays.map(({ day, weekday, month, monthName, year }, index) => (
              <DayHeaderCell
                key={index}
                index={index}
                day={day}
                weekday={weekday}
                month={month}
                monthName={monthName}
                year={year}
                today={today}
              />
            ))}
          </tr>
        </thead>

        <tbody>
          {rooms.map((room, rowIndex) => (
            <tr key={room.id || rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}>
              <td className="sticky left-0 z-20 border-r border-gray-100 bg-white p-2 font-semibold text-gray-700 text-sm">
                {room.name}
              </td>
              {allDays.map((_, dayIndex) => (
                <DaysCalendar
                  key={`${room.id || rowIndex}-${dayIndex}`}
                  rowIndex={rowIndex}
                  dayIndex={dayIndex}
                  cellClasses={getCellClasses(rowIndex, dayIndex)}
                  barInfo={getBarInfo(rowIndex, dayIndex)}
                  onMouseDown={startSelection}
                  onMouseEnter={updateSelection}
                  onMouseUp={endSelection}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
