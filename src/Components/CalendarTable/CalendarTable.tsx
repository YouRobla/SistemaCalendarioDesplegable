import { type RefObject, useRef, useEffect } from "react";
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

  // Ref para el contenedor de scroll vertical
  const verticalScrollRef = useRef<HTMLDivElement>(null);

  // Virtualización horizontal de columnas (días)
  const columnVirtualizer = useVirtualizer({
    count: allDays.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 85,
    horizontal: true,
    overscan: 3,
  });

  // Virtualización vertical de filas (habitaciones)
  const rowVirtualizer = useVirtualizer({
    count: rooms.length,
    getScrollElement: () => verticalScrollRef.current,
    estimateSize: () => 80,
    overscan: 2,
  });

  // Log para verificar virtualización
  useEffect(() => {
    const visibleRows = rowVirtualizer.getVirtualItems().length;
    const visibleCols = columnVirtualizer.getVirtualItems().length;
    const totalCells = visibleRows * visibleCols;
    const totalPossibleCells = rooms.length * allDays.length;
    const reduction = ((1 - totalCells / totalPossibleCells) * 100).toFixed(1);
    
    console.log(`🚀 Virtualización activa:`);
    console.log(`  📊 Filas visibles: ${visibleRows} de ${rooms.length} habitaciones`);
    console.log(`  📊 Columnas visibles: ${visibleCols} de ${allDays.length} días`);
    console.log(`  📊 Celdas renderizadas: ${totalCells} de ${totalPossibleCells} posibles`);
    console.log(`  ✅ Reducción de renderizado: ${reduction}%`);
  }, [rooms.length, allDays.length, rowVirtualizer, columnVirtualizer]);

  return (
    <div 
      ref={verticalScrollRef}
      className="rounded-2xl border border-gray-100 bg-white shadow-lg flex flex-col"
      style={{ 
        maxHeight: needsVerticalScroll ? `${maxVisibleHeight}px` : 'none',
        overflowY: needsVerticalScroll ? 'auto' : 'visible',
        overflowX: 'hidden',
      }}
    >
      {/* Contenedor principal con scroll vertical compartido */}
      <div className="flex shrink-0" style={{ height: `${rowVirtualizer.getTotalSize() + 80}px`, position: 'relative' }}>
        {/* Columna fija de Habitaciones (virtualizada verticalmente) */}
        <div 
          className="shrink-0 border-r border-gray-200 bg-gray-50 sticky left-0"
          style={{ width: '150px', height: `${rowVirtualizer.getTotalSize() + 80}px` }}
        >
          {/* Header de Habitaciones - sticky */}
          <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 h-20 flex items-center justify-center font-semibold text-gray-700">
            Habitaciones
          </div>
          {/* Lista de habitaciones virtualizadas */}
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const room = rooms[virtualRow.index];
              return (
                <div
                  key={room.id || virtualRow.index}
                  className="border-b border-gray-200 bg-white flex items-center p-2 font-semibold text-gray-700 text-sm"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {room.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Área scrollable de días (solo scroll horizontal, el vertical viene del padre) */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto"
          style={{ 
            whiteSpace: "nowrap", 
            overflowY: 'hidden',
            height: `${rowVirtualizer.getTotalSize() + 80}px`
          }}
        >
          <div className="inline-block min-w-max" style={{ height: `${rowVirtualizer.getTotalSize() + 80}px`, position: 'relative' }}>
            {/* Header row - sticky top */}
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

          {/* Body rows - virtualizadas verticalmente */}
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const room = rooms[virtualRow.index];
              const rowIndex = virtualRow.index;
              
              return (
                <div
                  key={room.id || rowIndex}
                  className="border-b border-gray-100 bg-white overflow-hidden"
                  style={{ 
                    width: `${columnVirtualizer.getTotalSize()}px`, 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
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
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
