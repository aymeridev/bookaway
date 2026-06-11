import React from 'react';
import { twMerge } from 'tailwind-merge';

const VARIANTS = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-content focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-content focus:ring-gray-400',
    danger: 'bg-error hover:bg-error/90 text-error-content focus:ring-red-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-400',
    flat: 'bg-transparent border-0 text-gray-600 hover:bg-gray-100 focus:ring-gray-200'
} as const;

const SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
} as const;

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    isLoading = false,
    ...props
}: ButtonProps) {

    const baseStyles = 'inline-flex gap-2 cursor-pointer items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none';

    const isButtonDisabled = disabled || isLoading;
    const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

    const classes = twMerge(
        baseStyles,
        VARIANTS[variant],
        SIZES[size],
        isButtonDisabled ? disabledStyles : '',
        className
    );

    return (
        <button className={classes} disabled={isButtonDisabled} {...props}>
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
}