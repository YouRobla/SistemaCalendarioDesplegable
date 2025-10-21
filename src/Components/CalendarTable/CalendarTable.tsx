import { type RefObject } from "react";
import { DayHeaderCell } from "../DayHeaderCell";
import { DaysCalendar } from "../DaysCalendar";
import type { CalendarDay } from "../../utils/calendarHelpers";
import { useBarStyles } from "../../hooks/useBarStyles";

interface CalendarTableProps {
  containerRef: RefObject<HTMLDivElement | null>;
  allDays: CalendarDay[];
  today: Date;
  rooms?: string[];
}

export const CalendarTable = ({
  containerRef,
  allDays,
  today,
  rooms = [
    "Habitación 1",
    "Habitación 2",
    "Habitación 3",
    "Habitación 4",
    "Habitación 5",
    "Habitación 6",
    "Habitación 7",
  ],
}: CalendarTableProps) => {
  const { 
    getCellClasses, 
    getBarInfo,
    startSelection, 
    updateSelection, 
    endSelection
  } = useBarStyles();

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-lg"
      style={{ whiteSpace: "nowrap" }}
    >
      <table className="min-w-max w-full border-separate border-spacing-0 text-center">
        <thead className="bg-linear-to-r from-blue-50 to-indigo-50">
          <tr>
            <th className="sticky left-0 z-20 border-r border-gray-100 bg-white/70 p-3 font-semibold text-gray-700 shadow-sm backdrop-blur-md">
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
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}>
              <td className="sticky left-0 z-20 border-r border-gray-100 bg-white p-2 font-semibold text-gray-700 text-sm">
                {room}
              </td>
              {allDays.map((_, dayIndex) => (
                <DaysCalendar
                  key={`${rowIndex}-${dayIndex}`}
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
