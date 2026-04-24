import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
          'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50': variant === 'outline',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'bg-transparent text-gray-700 hover:bg-gray-100': variant === 'ghost',
          'h-9 px-4 py-2 text-sm': size === 'md',
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-8 text-base': size === 'lg',
          'h-9 w-9 p-0': size === 'icon',
        },
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = "Button";
