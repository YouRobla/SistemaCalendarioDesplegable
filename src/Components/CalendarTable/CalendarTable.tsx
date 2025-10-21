import { type RefObject } from "react";
import { MothCalendar } from "../MothCalenda";
import { DaysCalendar } from "../DaysCalendar";

interface CalendarDay {
  day: number;
  weekday: string;
  month: number;
  monthName: string;
  year: number;
}

interface CalendarTableProps {
  containerRef: RefObject<HTMLDivElement | null>;
  allDays: CalendarDay[];
  today: Date;
}

export const CalendarTable = ({ containerRef, allDays, today }: CalendarTableProps) => {
  return (
    <div
      ref={containerRef}
      className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-100"
      style={{ whiteSpace: "nowrap" }}
    >
      <table className="border-collapse text-center min-w-max w-full divide-y divide-gray-200/40">
        <thead className="bg-linear-to-r from-blue-50 to-indigo-50">
          <tr>
            <th className="p-3 sticky left-0 bg-white/70 backdrop-blur-md text-gray-700 font-semibold shadow-sm border-r border-gray-100">
              Habitaciones
            </th>
            {allDays.map(({ day, weekday, monthName, year }, index) => (
              <MothCalendar
                key={index}
                index={index}
                day={day}
                weekday={weekday}
                monthName={monthName}
                year={year}
                today={today}
              />
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200/40">
          <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 1
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr>
          <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 2
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr> <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 3
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr> <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 4
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr> <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 5
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr> <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 6
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr> <tr>
            <td className="p-3 bg-white sticky left-0 text-gray-700 font-semibold border-r border-gray-100">
              Habitacion 7
            </td>
            
            {allDays.map((_, index) => (
              <DaysCalendar key={index} index={index} />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
