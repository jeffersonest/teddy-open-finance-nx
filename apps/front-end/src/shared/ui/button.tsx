import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'
  | 'outlineDanger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#ec6724] text-white hover:bg-[#d95d20] disabled:bg-[#f3b291]',
  secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  outline: 'border-2 border-[#ec6724] bg-transparent text-[#ec6724] hover:bg-[#fff4ed]',
  outlineDanger: 'border-2 border-[#dc2626] bg-transparent text-[#dc2626] hover:bg-[#fef2f2]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 py-2 text-sm',
  md: 'min-h-10 px-4 py-2 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-[4px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = 'Button';
