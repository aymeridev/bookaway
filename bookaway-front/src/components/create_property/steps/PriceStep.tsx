import type { UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
import Input from "../../ui/Input";

export function PriceStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const { register } = form;

    return (
        <>
            <Input
                label="Prix de base"
                {...register('base_price', { required: "Le prix de base est requis" })}
                className="mt-1 block w-full"
                placeholder="Prix en €"
                type="number"
                min={1} max={999} />
            <Input
                label="Prix par nuit"
                {...register('price_per_night', { required: "Le prix par nuit est requis" })}
                className="mt-1 block w-full"
                placeholder="Prix en €"
                type="number"
                min={1} max={999} />
        </>
    )
}