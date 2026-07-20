import type { HTMLAttributes } from "react";
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={twMerge("card bg-base-200 shadow-md", className)}>
        <div className="card-body">
            {children}
        </div>
    </div>
}