export function Stepper({ steps, currentStep }: { currentStep: number, steps: { name: string, description: string }[] }) {
    return (
        <ul className="min-w-xs flex flex-col gap-1">
            {steps.map(({ name, description }, i) => (
                <li className="flex items-center gap-2">
                    <span
                        data-primary={currentStep >= i}
                        className="transition-colors primary:bg-amber-400 bg-gray-400 rounded-full primary:text-amber-100 font-semibold text-lg size-8 flex items-center justify-center">{i + 1}</span>
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{name}</h3>
                        <p className="text-sm">{description}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}