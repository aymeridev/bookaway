import type { HTMLAttributes } from "react";
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={twMerge("bg-base-200 text-base-content rounded-lg shadow-md p-4", className)}>
        {children}
    </div>
}