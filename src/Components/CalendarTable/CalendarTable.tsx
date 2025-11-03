import { useRef, useEffect, useMemo, type RefObject } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DayHeaderCell } from "../DayHeaderCell";
import { DaysCalendar } from "../DaysCalendar";
import { useBarStyles } from "../../hooks/useBarStyles";
import type { CalendarDay } from "../../utils/calendarHelpers";
import type { HotelRoom } from "../../api/HotelRooms";
import { useCallback } from "react";

interface CalendarTableProps {
  containerRef: RefObject<HTMLDivElement | null>;
  allDays: CalendarDay[];
  today: Date;
  rooms: HotelRoom[];
}

const ROW_HEIGHT = 80;
const HEADER_HEIGHT = 80;

export const CalendarTable = ({
  containerRef,
  allDays,
  today,
  rooms,
}: CalendarTableProps) => {
  const { getCellClasses, getBarsForRoom, startSelection, updateSelection, endSelection } =
    useBarStyles();

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const roomsColumnRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);

  // Memoizar cálculos de altura
  const heightConfig = useMemo(() => {
    const totalHeight = HEADER_HEIGHT + rooms.length * ROW_HEIGHT;
    const maxVisibleHeight = Math.min(totalHeight, window.innerHeight * 0.7);
    const needsScroll = totalHeight > maxVisibleHeight;
    const contentHeight = needsScroll 
      ? maxVisibleHeight - HEADER_HEIGHT 
      : rooms.length * ROW_HEIGHT;
    
    return { totalHeight, maxVisibleHeight, needsScroll, contentHeight };
  }, [rooms.length]);

  // Scroll horizontal sincronizado (encabezado ↔ contenido)
  useEffect(() => {
    const header = containerRef.current;
    const main = mainScrollRef.current;
    if (!header || !main) return;

    const syncScroll = (e: Event) => {
      if (syncingRef.current) return;
      const source = e.target as HTMLElement;
      const target = source === header ? main : header;
      
      syncingRef.current = true;
      target.scrollLeft = source.scrollLeft;
      requestAnimationFrame(() => {
        syncingRef.current = false;
      });
    };

    header.addEventListener("scroll", syncScroll, { passive: true });
    main.addEventListener("scroll", syncScroll, { passive: true });
    main.scrollLeft = header.scrollLeft;

    return () => {
      header.removeEventListener("scroll", syncScroll);
      main.removeEventListener("scroll", syncScroll);
    };
  }, [containerRef]);

  // Scroll vertical sincronizado (habitaciones ↔ contenido)
  useEffect(() => {
    const main = mainScrollRef.current;
    const roomsCol = roomsColumnRef.current;
    if (!main || !roomsCol) return;

    const syncScroll = (e: Event) => {
      if (syncingRef.current) return;
      const source = e.target as HTMLElement;
      const target = source === main ? roomsCol : main;
      
      syncingRef.current = true;
      target.scrollTop = source.scrollTop;
      requestAnimationFrame(() => {
        syncingRef.current = false;
      });
    };

    main.addEventListener("scroll", syncScroll, { passive: true });
    roomsCol.addEventListener("scroll", syncScroll, { passive: true });

    return () => {
      main.removeEventListener("scroll", syncScroll);
      roomsCol.removeEventListener("scroll", syncScroll);
    };
  }, []);

  // Virtualizadores
  const columnVirtualizer = useVirtualizer({
    count: allDays.length,
    getScrollElement: () => mainScrollRef.current,
    estimateSize: () => 85,
    horizontal: true,
    overscan: 3,
  });

  const rowVirtualizer = useVirtualizer({
    count: rooms.length,
    getScrollElement: () => mainScrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 2,
  });

  // Items virtuales
  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  // Mapa de posiciones de columnas
  const columnPositions = useMemo(() => {
    const map = new Map<number, { start: number; size: number }>();
    virtualColumns.forEach(col => {
      map.set(col.index, { start: col.start, size: col.size });
    });
    return map;
  }, [virtualColumns]);


  const handleCellInteraction = useCallback((
    type: 'down' | 'enter' | 'up',
    room: number,
    day: number,
    buttons?: number
  ) => {
    switch (type) {
      case 'down':
        startSelection(room, day);
        break;
      case 'enter':
        if (buttons === 1) updateSelection(room, day);
        break;
      case 'up':
        endSelection();
        break;
    }
  }, [startSelection, updateSelection, endSelection]);


  return (
    <div className="flex rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      {/* Columna de Habitaciones */}
      <div className="flex flex-col w-[150px] border-r border-gray-200 bg-gray-50">
        <div className="h-20 flex items-center justify-center font-semibold text-gray-700 border-b-2 border-gray-300 bg-gray-50 flex-shrink-0">
          Habitaciones
        </div>

        <div 
          ref={roomsColumnRef} 
          className="overflow-y-scroll overflow-x-hidden scrollbar-thin flex-1"
          style={{ 
            height: `${heightConfig.contentHeight}px`,
            scrollbarGutter: 'stable'
          }}
        >
          <div style={{ 
            height: `${rowVirtualizer.getTotalSize()}px`, 
            position: 'relative',
            width: '100%'
          }}>
            {virtualRows.map((vRow) => {
              const room = rooms[vRow.index];
              if (!room) return null;
              
              return (
                <div
                  key={room.id}
                  className="absolute w-full border-b border-gray-200 flex items-center px-3 font-semibold text-gray-700 text-sm bg-white"
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    transform: `translateY(${vRow.start}px)`,
                  }}
                >
                  {room.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendario Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Encabezado de Días */}
        <div className="h-20 border-b-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div ref={containerRef} className="overflow-x-scroll overflow-y-hidden h-full scrollbar-thin">
            <div style={{ 
              width: `${columnVirtualizer.getTotalSize()}px`, 
              height: '100%', 
              position: 'relative' 
            }}>
              {virtualColumns.map((vCol) => (
                <div
                  key={vCol.index}
                  className="absolute top-0"
                  style={{
                    width: `${vCol.size}px`,
                    height: `${HEADER_HEIGHT}px`,
                    transform: `translateX(${vCol.start}px)`,
                  }}
                >
                  <DayHeaderCell {...allDays[vCol.index]} today={today} index={vCol.index} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cuerpo del Calendario */}
        <div
          ref={mainScrollRef}
          className="overflow-scroll scrollbar-thin flex-1"
          style={{ 
            height: `${heightConfig.contentHeight}px`,
            scrollbarGutter: 'stable'
          }}
        >
          <div
            style={{
              width: `${columnVirtualizer.getTotalSize()}px`,
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {virtualRows.map((vRow) => {
              const room = rooms[vRow.index];
              const bars = getBarsForRoom(vRow.index);
              
              return (
                <div
                  key={room.id}
                  className="absolute border-b border-gray-100"
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    width: '100%',
                    transform: `translateY(${vRow.start}px)`,
                  }}
                >
                  {/* Celdas */}
                  {virtualColumns.map((vCol) => (
                    <div
                      key={`${room.id}-${vCol.index}`}
                      className="absolute"
                      style={{
                        width: `${vCol.size}px`,
                        height: `${ROW_HEIGHT}px`,
                        transform: `translateX(${vCol.start}px)`,
                      }}
                    >
    <DaysCalendar
            rowIndex={vRow.index}
            dayIndex={vCol.index}
            cellClasses={getCellClasses(vRow.index, vCol.index) || ""}
            onMouseDown={startSelection}
            onMouseEnter={updateSelection}
            onMouseUp={endSelection}
          />
                    </div>
                  ))}

                  {/* Barras de Selección */}
                  {bars.map((bar, i) => {
                    const startCol = columnPositions.get(bar.start);
                    const endCol = columnPositions.get(bar.end);
                    if (!startCol || !endCol) return null;

                    const left = startCol.start;
                    const width = endCol.start + endCol.size - startCol.start;

                    return (
                      <div
                        key={`bar-${i}`}
                        className="absolute z-30"
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          height: `${ROW_HEIGHT}px`,
                        }}
                      >
                        <div
                          className={`absolute inset-2 my-6 rounded-xl transition-all duration-150 cursor-pointer ${
                            bar.isActive
                              ? "bg-blue-500 shadow-lg"
                              : "bg-green-500 shadow-md hover:bg-green-600 hover:shadow-lg"
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startSelection(vRow.index, bar.start);
                          }}
                          onMouseEnter={(e) =>
                            e.buttons === 1 && updateSelection(vRow.index, bar.end)
                          }
                          onMouseUp={endSelection}
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
  );
};