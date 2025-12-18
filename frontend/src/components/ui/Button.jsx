import { cn } from '../../utils/cn';

export const Button = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled,
  ...props
}) => {
  const variants = {
    default:
      'border border-border/80 bg-slate-900/80 text-foreground shadow-[0_10px_35px_rgba(0,0,0,0.45)] hover:border-primary/60 hover:bg-slate-800/80',
    gradient:
      'neon-button text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(34,211,238,0.55)]',
    outline:
      'border border-border/80 bg-transparent text-foreground hover:border-primary/50 hover:bg-white/5',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-white/5',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizes = {
    default: 'h-11 px-5',
    sm: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-11 w-11',
  };

  return (
    <button
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
