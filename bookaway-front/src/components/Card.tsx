import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
    return <div className="bg-white rounded-lg shadow-md p-4">
        {children}
    </div>
}