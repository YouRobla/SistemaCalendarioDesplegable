import { type RefObject } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DayHeaderCell } from "../DayHeaderCell";
import { DaysCalendar } from "../DaysCalendar";
import type { CalendarDay } from "../../utils/calendarHelpers";
import { useBarStyles } from "../../hooks/useBarStyles";
import type { HotelRoom } from "../../api/HotelRooms";

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
    getBarsForRoom,
    startSelection, 
    updateSelection, 
    endSelection
  } = useBarStyles();

  const COLUMN_WIDTH = 85;

  // Siempre habilitar scroll vertical si hay múltiples habitaciones
  // Calcular altura total: header (80px) + (número de habitaciones * 80px)
  const totalHeight = 80 + (rooms.length * 80); // Header + filas
  const maxVisibleHeight = Math.min(totalHeight, window.innerHeight * 0.7); // Máximo 70vh
  const needsVerticalScroll = totalHeight > maxVisibleHeight;

  // Virtualización horizontal de columnas (días) con @tanstack/react-virtual
  const columnVirtualizer = useVirtualizer({
    count: allDays.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 85,
    horizontal: true,
    overscan: 3,
  });

  return (
    <div 
      className="rounded-2xl border border-gray-100 bg-white shadow-lg flex flex-col"
      style={{ 
        maxHeight: needsVerticalScroll ? `${maxVisibleHeight}px` : 'none',
        overflowY: needsVerticalScroll ? 'auto' : 'visible',
        overflowX: 'hidden',
      }}
    >
      {/* Contenedor principal con scroll vertical compartido */}
      <div className="flex shrink-0" style={{ minHeight: `${totalHeight}px` }}>
        {/* Columna fija de Habitaciones (NO tiene scroll propio, se mueve con el scroll principal) */}
        <div 
          className="shrink-0 border-r border-gray-200 bg-gray-50"
          style={{ width: '150px', height: `${totalHeight}px` }}
        >
          {/* Header de Habitaciones - sticky para que no se mueva con scroll vertical */}
          <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 h-20 flex items-center justify-center font-semibold text-gray-700">
            Habitaciones
          </div>
          {/* Lista de habitaciones - se mueve con el scroll vertical del contenedor principal */}
          {rooms.map((room, rowIndex) => (
            <div
              key={room.id || rowIndex}
              className="border-b border-gray-200 bg-white h-20 flex items-center p-2 font-semibold text-gray-700 text-sm"
            >
              {room.name}
            </div>
          ))}
        </div>

        {/* Área scrollable de días (solo scroll horizontal, el vertical viene del padre) */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto"
          style={{ 
            whiteSpace: "nowrap", 
            overflowY: 'hidden',
            height: `${totalHeight}px`
          }}
        >
          <div className="inline-block min-w-max" style={{ height: `${totalHeight}px` }}>
            {/* Header row - sticky top para que no se mueva con scroll vertical */}
            <div className={`sticky top-0 z-30 bg-linear-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-300`} style={{ width: `${columnVirtualizer.getTotalSize()}px`, position: 'relative', height: '80px' }}>
            {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
              const day = allDays[virtualColumn.index];
              return (
                <div
                  key={virtualColumn.index}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${virtualColumn.size}px`,
                    transform: `translateX(${virtualColumn.start}px)`,
                  }}
                >
                  <DayHeaderCell
                    index={virtualColumn.index}
                    day={day.day}
                    weekday={day.weekday}
                    month={day.month}
                    monthName={day.monthName}
                    year={day.year}
                    today={today}
                  />
                </div>
              );
            })}
          </div>

          {/* Body rows - solo celdas de días */}
          {rooms.map((room, rowIndex) => (
            <div
              key={room.id || rowIndex}
              className="border-b border-gray-100 bg-white h-20 overflow-hidden"
              style={{ width: `${columnVirtualizer.getTotalSize()}px`, position: 'relative' }}
            >
              {/* Renderizar celdas */}
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                const dayIndex = virtualColumn.index;
                return (
                  <div
                    key={`${room.id || rowIndex}-${dayIndex}`}
                    className="absolute left-0 top-0 will-change-transform"
                    style={{
                      width: `${virtualColumn.size}px`,
                      transform: `translateX(${virtualColumn.start}px)`,
                    }}
                  >
                    <div style={{ height: '80px' }}>
                      <DaysCalendar
                        rowIndex={rowIndex}
                        dayIndex={dayIndex}
                        cellClasses={getCellClasses(rowIndex, dayIndex) || ''}
                        onMouseDown={startSelection}
                        onMouseEnter={updateSelection}
                        onMouseUp={endSelection}
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Renderizar barras continuas sobre las celdas */}
              {getBarsForRoom(rowIndex).map((bar, barIndex) => {
                const visibleItems = columnVirtualizer.getVirtualItems();
                if (visibleItems.length === 0) return null;
                
                const visibleStartIndex = visibleItems[0].index;
                const visibleEndIndex = visibleItems[visibleItems.length - 1].index;
                
                // Verificar si la barra intersecta con las columnas visibles
                if (bar.end < visibleStartIndex || bar.start > visibleEndIndex) {
                  return null;
                }
                
                // Calcular la posición de inicio
                let startPos: number;
                const startVirtual = visibleItems.find(v => v.index === bar.start);
                if (startVirtual) {
                  startPos = startVirtual.start;
                } else if (bar.start < visibleStartIndex) {
                  startPos = visibleItems[0].start;
                } else {
                  startPos = (bar.start - visibleStartIndex) * COLUMN_WIDTH + visibleItems[0].start;
                }
                
                // Calcular la posición de fin
                let endPos: number;
                const endVirtual = visibleItems.find(v => v.index === bar.end);
                if (endVirtual) {
                  endPos = endVirtual.start + endVirtual.size;
                } else if (bar.end > visibleEndIndex) {
                  const lastVisible = visibleItems[visibleItems.length - 1];
                  endPos = lastVisible.start + lastVisible.size;
                } else {
                  endPos = ((bar.end - visibleStartIndex + 1) * COLUMN_WIDTH) + visibleItems[0].start;
                }
                
                const barWidth = endPos - startPos;
                
                return (
                  <div
                    key={`bar-${rowIndex}-${bar.start}-${bar.end}-${barIndex}`}
                    className="absolute top-0 bottom-0 z-30 flex items-center pointer-events-none"
                    style={{
                      left: `${startPos}px`,
                      width: `${barWidth}px`,
                      height: '80px',
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <div
                      className={`absolute left-2 right-2 top-6 bottom-6 rounded-xl transition-all duration-150 pointer-events-auto ${
                        bar.isActive 
                          ? 'bg-blue-500 shadow-lg' 
                          : 'bg-green-500 shadow-md hover:shadow-lg hover:bg-green-600'
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startSelection(rowIndex, bar.start);
                      }}
                      onMouseEnter={(e) => {
                        if (e.buttons === 1) {
                          updateSelection(rowIndex, bar.end);
                        }
                      }}
                      onMouseUp={endSelection}
                      style={{
                        cursor: 'pointer',
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
