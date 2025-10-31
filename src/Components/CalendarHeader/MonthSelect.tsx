import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

interface MonthSelectProps {
  months: string[];
  value: number;
  onChange: (month: number) => void;
}

export const MonthSelect = ({ months, value, onChange }: MonthSelectProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
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

  // 🔹 Selección de mes
  const selectMonth = useCallback(
    (monthIndex: number) => {
      onChange(monthIndex);
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

      const total = months.length;
      const actions: Record<string, () => void> = {
        ArrowDown: () => setActive((prev) => (prev + 1) % total),
        ArrowUp: () => setActive((prev) => (prev - 1 + total) % total),
        Home: () => setActive(0),
        End: () => setActive(total - 1),
        Enter: () => selectMonth(active),
        Escape: () => setOpen(false),
      };

      const action = actions[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    },
    [open, months.length, value, active, selectMonth]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`inline-flex w-48 items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          open
            ? "border-indigo-300 bg-white text-gray-900"
            : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
        }`}
      >
        <span>{months[value]}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={`month-option-${active}`}
          className="absolute z-40 mt-1 w-48 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {months.map((label, idx) => {
            const selected = idx === value;
            const isActive = idx === active;
            return (
              <li
                id={`month-option-${idx}`}
                key={label}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(idx)}
                onClick={() => selectMonth(idx)}
                className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                  selected
                    ? "bg-indigo-600 text-white"
                    : isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
