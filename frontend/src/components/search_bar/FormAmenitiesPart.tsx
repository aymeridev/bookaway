import Select from 'react-select'
import { amenitiesOptions } from "../../amenities";
import makeAnimated from 'react-select/animated';

export function FormAmenitiesPart() {
    const animatedComponents = makeAnimated();

    return (
        <div>
            <label>Équipements/Options</label>
            <Select
                options={amenitiesOptions}
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
        </div>
    )
}
