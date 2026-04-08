
import { Search, X } from "lucide-react";
import { useState } from "react"
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { amenities } from "../amenities";
import { useForm, type SubmitHandler, useFieldArray, type UseFormReturn, Controller } from "react-hook-form";
import { Card } from "../components/Card";

type PropertyForm = {
    title: string,
    type: string,
    capacity: string,
    images: { url: string }[],
    amenities: { value: string }[],
    description: string,
    base_price: string,
    price_per_night: string,
    latitude: string,
    longitude: string
}

export function CreateProperyPage() {
    const form = useForm<PropertyForm>({
        defaultValues: {
            amenities: [],
            images: []
        }
    });
    const { register, handleSubmit, formState: { errors } } = form;

    const onSubmit: SubmitHandler<PropertyForm> = (data) => {
        const formData = {
            ...data,
            images: data.images.map(img => img.url)
        };
        console.log(formData);
    }

    return <>
        <Banner />
        <form onSubmit={handleSubmit(onSubmit)} action="" className="flex flex-col gap-4 m-4 max-w-md">
            <label className="block">
                <span className="text-gray-700">Titre</span>
                <input
                    {...register('title', { required: "Le titre est requis" })}
                    className="mt-1 block w-full"
                    type="text" />
            </label>

            <label className="block">
                <span className="text-gray-700">Type de logement</span>
                <select className="mt-1 block w-full">
                    <option selected disabled>Selectionner un type de logement</option>
                    <option value="camping">Camping</option>
                    <option value="hotel">Hôtel</option>
                </select>
            </label>

            <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea {...register('description')} className="mt-1 block w-full"></textarea>
            </label>

            <label className="block">
                <span className="text-gray-700">Capacité</span>
                <p>Nombre de voyageurs maximum</p>
                <input
                    {...register('capacity', { required: "Le nombre de voyageurs est requis" })}
                    className="mt-1 block w-full" type="number" min={1} max={99} />
                {errors.capacity && <p style={{ color: 'red' }}>{errors.capacity.message}</p>}
            </label>
            <Card>
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
            </Card>
            <ImagesInput form={form} />
            <AmenitiesInput form={form} />
            <LocationInput form={form} />
            <input className="bg-blue-500 p-2 text-blue-50 cursor-pointer rounded text-lg font-medium" value={"Créer la propriété"} type="submit" />
        </form >
    </>
}

function ImagesInput({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const { register, control } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "images"
    });

    return <Card>
        <label className="block">
            <span className="text-gray-700">Images</span>
            <ul>
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <input type="url" placeholder="https://..."
                            {...register(`images.${index}.url` as const)}
                        />
                        <button type="button" onClick={() => remove(index)}>
                            <X className="size-5" />
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex gap-1">
                <button onClick={() => append({ url: "" })}
                    type="button"
                    className="bg-blue-500 p-2 rounded text-blue-50 cursor-pointer w-full">
                    Ajouter
                </button>
            </div>
        </label>
    </Card>;
}

function AmenitiesInput({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const animatedComponents = makeAnimated();
    const { control } = form;

    const amenitiesOptions = amenities.map(a => {
        return {
            icon: a[0],
            value: a[1],
            label: a[1],
        }
    });
    return <label className="block">
        <span className="text-gray-700">Équipements</span>
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

function LocationInput({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const { register } = form;
    const [location, setLocation] = useState<[string, string]>(["", ""]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    return (
        <Card>
            <input type="hidden" defaultValue={location[0]} readOnly {...register("latitude")} />
            <input type="hidden" defaultValue={location[1]} readOnly {...register("longitude")} />
            <label className="block">
                <span className="text-gray-700">Adresse du logement</span>
                <div className="flex gap-1">
                    <input
                        value={search}
                        type="search"
                        onChange={(e) => {
                            setSearch((e.target as any).value);
                        }} className="mt-1 block w-full" />
                    {search.length > 0 &&
                        <button onClick={async () => {

                            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&email=ulco@ulco.fr`);

                            const data = await res.json();
                            console.log(data);
                            setResults(data);

                        }} type="button" className="bg-blue-500 cursor-pointer p-2 text-white rounded">
                            <Search />
                        </button>
                    }
                </div>
            </label>
            {results.length > 0 && <ul>
                {results.map((result: any) => (
                    <li key={result.place_id}>
                        <button type="button" onClick={() => {
                            setLocation([result.lat, result.lon]);
                            setResults([]);
                            setSearch(result.display_name);
                        }}>{result.display_name}</button>
                    </li>
                ))}
            </ul>}
        </Card>
    )

}

function Banner() {
    return (
        <div className="relative flex bg-no-repeat bg-hero p-16 bg-center bg-cover">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <div className="z-10 flex flex-col gap-2 text-white">
                <h2 className="text-3xl font-semibold font-display">Ajouter un logement</h2>
                <p>Remplissez le formulaire ci-dessous pour ajouter un nouveau logement à la plateforme.</p>
            </div>
        </div>
    )
}