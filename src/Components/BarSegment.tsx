import { memo } from 'react';

interface BarSegmentProps {
  roomIndex: number;
  dayIndex: number;
  isActive: boolean;
  position: 'head' | 'body' | 'tail' | 'single';
  onMouseDown: (roomIndex: number, dayIndex: number) => void;
  onMouseEnter: (roomIndex: number, dayIndex: number) => void;
  onMouseUp: () => void;
}

export const BarSegment = memo(function BarSegment({
  roomIndex,
  dayIndex,
  isActive,
  position,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: BarSegmentProps) {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onMouseDown(roomIndex, dayIndex);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      onMouseEnter(roomIndex, dayIndex);
    }
  };

  return (
    <div
      className={`absolute top-2 bottom-2 left-0 right-0 cursor-crosshair ${
        isActive ? 'bg-blue-500' : 'bg-emerald-500'
      } ${
        position === 'head' ? 'rounded-l-full' :
        position === 'tail' ? 'rounded-r-full' :
        position === 'single' ? 'rounded-full' : 'rounded-none'
      }`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={onMouseUp}
    />
  );
});
