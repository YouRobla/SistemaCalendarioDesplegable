import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { Hotel } from "../../api/Hotels";

interface HotelSelectProps {
  hotels: Hotel[];
  value: number | null;
  onChange: (hotelId: number | null) => void;
}

export const HotelSelect = ({ hotels, value, onChange }: HotelSelectProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔹 Sincroniza valor activo con el valor actual
  useEffect(() => setActive(value), [value]);

  // 🔹 Cierra al hacer clic fuera o presionar ESC
  useEffect(() => {
    const handleGlobalEvents = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleGlobalEvents);
    document.addEventListener("keydown", handleGlobalEvents);
    return () => {
      document.removeEventListener("mousedown", handleGlobalEvents);
      document.removeEventListener("keydown", handleGlobalEvents);
    };
  }, []);

  // 🔹 Selección de hotel
  const selectHotel = useCallback(
    (hotelId: number | null) => {
      onChange(hotelId);
      setOpen(false);
    },
    [onChange]
  );

  // 🔹 Navegación por teclado
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (!open && ["ArrowDown", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
        setActive(value);
        return;
      }

      if (!open) return;

      const total = hotels.length + 1; // +1 para la opción "Seleccionar hotel"
      const currentIndex = active === null ? 0 : hotels.findIndex(h => h.id === active) + 1;
      
      const actions: Record<string, () => void> = {
        ArrowDown: () => {
          const next = (currentIndex + 1) % total;
          setActive(next === 0 ? null : hotels[next - 1].id);
        },
        ArrowUp: () => {
          const prev = (currentIndex - 1 + total) % total;
          setActive(prev === 0 ? null : hotels[prev - 1].id);
        },
        Home: () => setActive(null),
        End: () => setActive(hotels.length > 0 ? hotels[hotels.length - 1].id : null),
        Enter: () => selectHotel(active),
        Escape: () => setOpen(false),
      };

      const action = actions[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    },
    [open, hotels, value, active, selectHotel]
  );

  const selectedHotel = value ? hotels.find(h => h.id === value) : null;
  const displayText = selectedHotel ? selectedHotel.name : "Escoger hotel";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`inline-flex w-64 items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          open
            ? "border-indigo-300 bg-white text-gray-900"
            : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
        }`}
      >
        <span className="truncate">{displayText}</span>
        <span className="text-gray-400 shrink-0">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={active !== null ? `hotel-option-${active}` : "hotel-option-none"}
          className="absolute z-40 mt-1 w-64 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {/* Opción para limpiar selección */}
          <li
            id="hotel-option-none"
            role="option"
            aria-selected={value === null}
            onMouseEnter={() => setActive(null)}
            onClick={() => selectHotel(null)}
            className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
              value === null
                ? "bg-indigo-600 text-white"
                : active === null
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Escoger hotel
          </li>
          
          {/* Lista de hoteles */}
          {hotels.map((hotel) => {
            const selected = hotel.id === value;
            const isActive = hotel.id === active;
            return (
              <li
                id={`hotel-option-${hotel.id}`}
                key={hotel.id}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(hotel.id)}
                onClick={() => selectHotel(hotel.id)}
                className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                  selected
                    ? "bg-indigo-600 text-white"
                    : isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {hotel.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
