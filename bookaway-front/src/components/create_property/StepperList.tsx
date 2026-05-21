import { t } from "i18next";
import Button from "../ui/Button";

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
                    <Button className="w-full justify-start" variant={currentStep === i ? "primary" : "flat"} onClick={() => onChange?.(i)}>
                        {t(`properties-edit.${id}` as any)}
                    </Button>
                </li>
            ))
            }
        </ul>
    )
}