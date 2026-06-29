import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';

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
    asChild?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    isLoading = false,
    asChild = false,
    ...props
}: ButtonProps) {

    const baseStyles = 'inline-flex gap-2 cursor-pointer items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none enabled:hover:scale-101 enabled:hover:shadow-lg shadow-primary/50 enabled:active:scale-99';

    const isButtonDisabled = disabled || isLoading;
    const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

    const classes = twMerge(
        baseStyles,
        VARIANTS[variant],
        SIZES[size],
        isButtonDisabled ? disabledStyles : '',
        className
    );

    if (asChild) {
        return (
            <Slot className={classes} {...props}>
                {children}
            </Slot>
        );
    }

    return (
        <button className={classes} disabled={isButtonDisabled} {...props}>
            {isLoading && <LoaderCircle className="animate-spin -ml-1 mr-2 size-4" />}
            {children}
        </button>
    );
}