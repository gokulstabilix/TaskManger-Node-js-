import React from 'react';

/**
 * FormInput — A reusable, accessible form field with built-in error display.
 *
 * Props:
 *  - id        : Unique ID (also used as htmlFor on label)
 *  - label     : The label text
 *  - type      : Input type (text | email | password)
 *  - value     : Controlled input value
 *  - onChange  : Change handler
 *  - error     : Error message string (if any)
 *  - icon      : Optional Lucide icon element
 *  - ...rest   : Any extra native input props (placeholder, autoComplete…)
 */
export const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  ...rest
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            w-full rounded-xl border px-4 py-3 text-sm outline-none
            transition-all duration-200
            placeholder:text-gray-400
            focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
            ${icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-red-400 bg-red-50/50 focus:ring-red-400/30 focus:border-red-400'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
          {...rest}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-500 flex items-center gap-1 mt-1"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
