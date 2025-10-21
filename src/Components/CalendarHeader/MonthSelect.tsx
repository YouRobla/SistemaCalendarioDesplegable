import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

interface MonthSelectProps {
  months: string[];
  value: number;
  onChange: (month: number) => void;
}

// Selector de mes personalizado con dropdown controlado y soporte de teclado.
export const MonthSelect = ({ months, value, onChange }: MonthSelectProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    setActive(value);
  }, [value]);

  const selectMonth = (monthIndex: number) => {
    onChange(monthIndex);
    setOpen(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!open && ["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActive(value);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((prev) => (prev + 1) % months.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((prev) => (prev - 1 + months.length) % months.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(months.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectMonth(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          open ? "border-indigo-300 bg-white text-gray-900" : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
        }`}
      >
        <span>{months[value]}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-activedescendant={`month-option-${active}`}
          className="absolute z-40 mt-1 w-48 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {months.map((monthLabel, idx) => {
            const selected = idx === value;
            const isActive = idx === active;
            return (
              <div
                id={`month-option-${idx}`}
                key={monthLabel}
                role="option"
                aria-selected={selected}
                className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                  selected
                    ? "bg-indigo-600 text-white"
                    : isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onMouseEnter={() => setActive(idx)}
                onClick={() => selectMonth(idx)}
              >
                {monthLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

