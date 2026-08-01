import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, select, textarea, [data-cursor]');
        if (interactive) {
          setIsHovered(true);
          const text = interactive.getAttribute('data-cursor');
          setCursorText(text || '');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Outer Crosshair Ring */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/60 transition-all duration-300 ease-out flex items-center justify-center ${
          isHovered ? 'w-16 h-16 bg-slate-900/10 border-blue-900 scale-110 shadow-lg' : 'w-8 h-8'
        }`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      >
        {cursorText && (
          <span className="text-[9px] font-mono-tech tracking-wider text-white uppercase whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded shadow border border-slate-700">
            {cursorText}
          </span>
        )}
      </div>

      {/* Center Precision Dot */}
      <div
        className="fixed w-1.5 h-1.5 bg-blue-900 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
    </div>
  );
};
