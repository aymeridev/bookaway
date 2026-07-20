import { t } from "i18next";

interface StepperProps {
    currentStep: number;
    steps: readonly { id: string }[];
    onChange?: (step: number) => void;
}

export function StepperList({ steps, currentStep, onChange }: StepperProps) {
    return (
        <ul className="min-w-xs bg-gray-200 flex flex-col gap-1 rounded-lg p-2">
            {steps.map(({ id }, i) => (
                <li key={id} className="flex items-center gap-2">
                    <button className={currentStep === i ? "btn btn-primary" : "btn btn-ghost"} onClick={() => onChange?.(i)}>
                        {t(`properties-edit.${id}` as any)}
                    </button>
                </li>
            ))
            }
        </ul>
    )
}