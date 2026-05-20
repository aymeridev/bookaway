import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', disabled, id, ...props }, ref) => {

        const generatedId = useId();
        const inputId = id || generatedId;

        const baseInputStyles = 'block w-full rounded-lg border px-3 py-2 text-base shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';

        const stateStyles = error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500';

        return (
            <div className="w-full flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'} ${disabled ? 'opacity-50' : ''}`}
                    >
                        {label}
                    </label>
                )}

                <input
                    id={inputId}
                    ref={ref}
                    disabled={disabled}
                    className={`${baseInputStyles} ${stateStyles} ${className}`}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-600 font-medium" id={`${inputId}-error`}>
                        {error}
                    </p>
                )}

                {!error && helperText && (
                    <p className="text-sm text-gray-500" id={`${inputId}-description`}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;