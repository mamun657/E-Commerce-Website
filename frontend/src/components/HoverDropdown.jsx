import { useState } from 'react';
import { cn } from '../utils/cn';

const HoverDropdown = ({
  trigger,
  children,
  align = 'right',
  widthClass = 'w-72',
  caretPosition = 'right-6',
  panelClassName = '',
  className = ''
}) => {
  const [open, setOpen] = useState(false);

  const alignmentClass = align === 'center'
    ? 'left-1/2 -translate-x-1/2'
    : align === 'left'
      ? 'left-0'
      : 'right-0';

  return (
    <div
      className={cn('relative inline-flex z-40 overflow-visible', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <div className="inline-flex">{trigger}</div>
      <div
        className={cn(
          'absolute top-full z-50 pt-3 transition-all duration-200 ease-out origin-top',
          alignmentClass,
          open
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        )}
      >
        <div className={cn('relative', widthClass)}>
          <span
            className={cn(
              'pointer-events-none absolute -top-2 h-4 w-4 rotate-45 rounded-sm bg-gradient-to-br from-emerald-400/90 via-cyan-400/80 to-purple-500/90 shadow-[0_5px_20px_rgba(0,0,0,0.35)]',
              caretPosition
            )}
          />
          <div
            className={cn(
              'rounded-2xl border border-border/70 bg-[rgba(13,19,33,0.9)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl text-foreground max-h-[70vh] overflow-y-auto overflow-x-visible',
              panelClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverDropdown;
