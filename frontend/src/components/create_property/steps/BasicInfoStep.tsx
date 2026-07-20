import type { UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";

export function BasicInfoStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {

    const { register, formState: { errors } } = form;

    return (
        <>
            <fieldset className="fieldset">
                <label className="label" htmlFor="name">Titre</label>
                <input type="text" id="name" className="input"
                    {...register('title', { required: "Le titre est requis" })}
                />
            </fieldset>

            <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea {...register('description')} className="mt-1 block w-full"></textarea>
            </label>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Capacité</legend>
                <input className="input" {...register('capacity', { required: "Le nombre de voyageurs est requis" })}
                    type="number" min={1} max={99} />
                <p className="label">Nombre de voyageurs maximum</p>
                {errors.capacity && <p style={{ color: 'red' }}>{errors.capacity.message}</p>}
            </fieldset>

        </>


    )
}