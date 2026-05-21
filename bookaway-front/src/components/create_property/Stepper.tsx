import { t } from "i18next";
import Button from "../ui/Button";

interface StepperProps {
    currentStep: number;
    steps: readonly { id: string }[];
    onChange?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onChange }: StepperProps) {
    return (
        <ul className="min-w-xs flex flex-col gap-4">
            {steps.map(({ id }, i) => (
                <li key={id} className="flex items-center gap-2">
                    {onChange ? (
                        <Button variant={currentStep === i ? "primary" : "outline"}>{t(`properties-edit.${id}` as any)}</Button>
                    ) : (
                        <>
                            <span
                                data-primary={currentStep >= i}
                                className="transition-colors primary:bg-blue-500 bg-gray-400 rounded-full primary:text-blue-100 font-semibold text-lg size-8 flex items-center justify-center">{i + 1}</span>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-gray-700">{t(`properties-edit.${id}` as any)}</h3>
                            </div>
                        </>
                    )}
                </li>
            ))
            }
        </ul >
    )
}