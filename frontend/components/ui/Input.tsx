import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  floatingLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, floatingLabel = true, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const showFloatingLabel = floatingLabel && (isFocused || hasValue);

    return (
      <div className="relative w-full">
        {label && floatingLabel ? (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none text-muted',
              showFloatingLabel
                ? 'top-2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-base'
            )}
          >
            {label}
          </label>
        ) : (
          label && (
            <label htmlFor={inputId} className="block text-sm font-medium mb-2">
              {label}
            </label>
          )
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus-visible:ring-error',
            floatingLabel && label && 'pt-6 pb-2',
            className
          )}
          ref={ref}
          id={inputId}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
