export function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`bg-input border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  placeholder = '',
  value = '',
  onChange = () => {},
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={`bg-input border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Select({
  value = '',
  onChange = () => {},
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
