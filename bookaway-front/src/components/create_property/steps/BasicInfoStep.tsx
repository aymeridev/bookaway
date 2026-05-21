import type { UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
import Input from "../../ui/Input";

export function BasicInfoStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {

    const { register, formState: { errors } } = form;

    return (
        <>
            <Input
                label="Titre"
                {...register('title', { required: "Le titre est requis" })}
            />

            <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea {...register('description')} className="mt-1 block w-full"></textarea>
            </label>

            <label className="block">
                <span className="text-gray-700">Capacité</span>
                <p>Nombre de voyageurs maximum</p>
                <Input
                    {...register('capacity', { required: "Le nombre de voyageurs est requis" })}
                    className="mt-1 block w-full"
                    type="number" min={1} max={99} />
                {errors.capacity && <p style={{ color: 'red' }}>{errors.capacity.message}</p>}
            </label>
        </>


    )
}