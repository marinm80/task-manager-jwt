import { forwardRef } from 'react';

// D-06: único punto de centralización del motion de hover de botones.
// `motion-safe:` aplica la elevación/sombra solo si el usuario no pidió
// movimiento reducido; `motion-reduce:` la anula explícitamente (RF-41).
const MOTION_CLASSES =
  'transition-transform duration-200 ease-out ' +
  'motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md ' +
  'motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none';

const FOCUS_CLASSES =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

const VARIANT_CLASSES = {
  primary: 'bg-green text-white hover:bg-green-hover',
  secondary: 'bg-surface text-ink border border-line hover:bg-mint/40',
  ghost: 'bg-transparent text-ink hover:bg-line/40',
  danger: 'bg-coral text-white hover:bg-coral-dark',
};

const SIZE_CLASSES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

// Botones `iconOnly` conservan la misma altura pero se vuelven cuadrados.
const ICON_ONLY_SIZE_CLASSES = {
  sm: 'h-9 w-9 p-0',
  md: 'h-11 w-11 p-0',
  lg: 'h-12 w-12 p-0',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    as: Component = 'button',
    to,
    isLoading = false,
    iconOnly = false,
    disabled = false,
    type,
    className = '',
    children,
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) {
  // RF-37: un botón de solo icono sin nombre accesible es un error de uso
  // del componente, no un estado válido — se documenta aquí en vez de
  // fallar en runtime, porque Button no puede adivinar la intención.
  if (iconOnly && !ariaLabel && process.env.NODE_ENV !== 'production') {
    console.warn(
      'Button: iconOnly requiere la prop aria-label para exponer un nombre accesible (RF-37).'
    );
  }

  const isButtonTag = Component === 'button';
  const sizeClasses = iconOnly ? ICON_ONLY_SIZE_CLASSES[size] : SIZE_CLASSES[size];

  const classes = [
    'inline-flex items-center justify-center rounded-btn font-semibold',
    'disabled:opacity-50 disabled:pointer-events-none',
    MOTION_CLASSES,
    FOCUS_CLASSES,
    VARIANT_CLASSES[variant],
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      ref={ref}
      to={isButtonTag ? undefined : to}
      type={isButtonTag ? type ?? 'button' : undefined}
      disabled={isButtonTag ? disabled || isLoading : undefined}
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      className={classes}
      {...rest}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </Component>
  );
});

export default Button;
