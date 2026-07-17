import type { UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";

export function PriceStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const { register } = form;

    return (
        <>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Prix de base</legend>
                <input type="number" className="input" placeholder="Type here"                 {...register('base_price', { required: "Le prix de base est requis" })}
                    min={1} max={999}
                />
                <p className="label">Optional</p>
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Prix par nuit</legend>
                <input
                    {...register('price_per_night', { required: "Le prix par nuit est requis" })}
                    className="input mt-1 block w-full"
                    placeholder="Prix en €"
                    type="number"
                    min={1} max={999} />
                <p className="label">Optional</p>
            </fieldset>
        </>
    )
}