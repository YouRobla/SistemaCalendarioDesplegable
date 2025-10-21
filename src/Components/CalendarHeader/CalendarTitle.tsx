import { useState, useEffect } from "react";

interface CalendarTitleProps {
  visibleMonth: string;
  visibleYear: number;
}

/**
 * Título del calendario que muestra el mes/año visibles
 * con una pequeña animación al cambiar.
 */
export const CalendarTitle = ({ visibleMonth, visibleYear }: CalendarTitleProps) => {
  const [displayText, setDisplayText] = useState(`${visibleMonth} ${visibleYear}`);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const newText = `${visibleMonth} ${visibleYear}`;
    if (displayText !== newText) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayText(newText);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [visibleMonth, visibleYear, displayText]);

  return (
    <div className="flex justify-center py-5 bg-linear-to-r from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-100/50">
      <h1 
        className={`text-3xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight transition-all duration-150 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {displayText}
      </h1>
    </div>
  );
};
