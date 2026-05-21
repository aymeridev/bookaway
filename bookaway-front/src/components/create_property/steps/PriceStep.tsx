import type { UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";

export function PriceStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const { register } = form;

    return (
        <>

            <label className="block">
                <span className="text-gray-700">Prix de base</span>
                <input
                    {...register('base_price', { required: "Le prix de base est requis" })}
                    className="mt-1 block w-full"
                    placeholder="Prix en €"
                    type="number"
                    min={1} max={999} />
            </label>
            <label className="block">
                <span className="text-gray-700">Prix par nuit</span>
                <input
                    {...register('price_per_night', { required: "Le prix par nuit est requis" })}
                    className="mt-1 block w-full"
                    placeholder="Prix en €"
                    type="number"
                    min={1} max={999} />
            </label>
        </>
    )
}