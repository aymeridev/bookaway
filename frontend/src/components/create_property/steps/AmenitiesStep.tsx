
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Controller, type UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
import { amenitiesOptions } from '../../../amenities';

export function AmenitiesStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const animatedComponents = makeAnimated();
    const { control } = form;


    return <label className="block">
        <span className="text-gray-700">Équipements/Options</span>
        <Controller
            name="amenities"
            defaultValue={[]}
            rules={{ required: "Séléctionne au moins un équipement" }}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <Select
                        options={amenitiesOptions}
                        {...field}
                        placeholder="Sélectionner..."
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        formatOptionLabel={(data: any) => {
                            const Icon = data.icon;
                            return (
                                <div className="flex items-center gap-2">
                                    {Icon && <Icon size={18} className="text-gray-500" />}
                                    <span>{data.label}</span>
                                </div>
                            )
                        }}
                        isMulti
                    />
                    {error && <p className="text-red-500">{error.message}</p>}
                </div>
            )}
        />
    </label>
}