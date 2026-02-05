export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50',
    outline: 'border border-border hover:bg-secondary disabled:opacity-50',
    ghost: 'hover:bg-secondary disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
