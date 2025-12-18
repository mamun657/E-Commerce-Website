import { cn } from '../../utils/cn';

export const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border/70 bg-card/80 text-card-foreground shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 ease-out',
        className
      )}
      {...props}
    />
  );
};

export const CardHeader = ({ className, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  );
};

export const CardTitle = ({ className, ...props }) => {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  );
};

export const CardDescription = ({ className, ...props }) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
};

export const CardContent = ({ className, ...props }) => {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
};

export const CardFooter = ({ className, ...props }) => {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
  );
};
