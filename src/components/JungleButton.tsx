import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface JungleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-leaf text-jungle-dark hover:bg-leaf-light',
  secondary: 'bg-white/10 text-mist hover:bg-white/20 border border-white/15',
  danger: 'bg-heat text-mist hover:bg-heat-glow',
};

/**
 * Shared button. Enforces the 44x44 minimum touch target (Requirement 8.4)
 * and the 24px radius. Extend via `variant`/props — do not copy button markup.
 */
export function JungleButton({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: JungleButtonProps) {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-card px-5 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
