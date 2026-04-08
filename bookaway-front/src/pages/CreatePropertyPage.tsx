
import { X } from "lucide-react";
import { useState } from "react"
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { amenities } from "../amenities";

export function CreateProperyPage() {
    return <>
        <form action="" className="flex flex-col gap-1 max-w-md">
            <label className="block">
                <span className="text-gray-700">Titre</span>
                <input className="mt-1 block w-full" type="text" />
            </label>

            <label className="block">
                <select>
                    <span className="text-gray-700">Type de logement</span>
                    <option value="camping">Camping</option>
                    <option value="hotel">Hôtel</option>
                </select>
            </label>

            <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea className="mt-1 block w-full"></textarea>
            </label>

            <label className="block">
                <span className="text-gray-700">Capacité</span>
                <p>Nombre de voyageurs maximum</p>
                <input className="mt-1 block w-full" type="number" min={1} max={99} />
            </label>
            <label className="block">
                <span className="text-gray-700">Prix de base</span>
                <input className="mt-1 block w-full" type="number" min={1} max={999} />
            </label>
            <label className="block">
                <span className="text-gray-700">Prix par nuit</span>
                <input className="mt-1 block w-full" type="number" min={1} max={999} />
            </label>
            <ImagesInput />
            <AmenitiesInput />
            <LocationInput />
            <input type="submit" />
        </form >
    </>
}

function ImagesInput() {
    let [inputSrc, setInputSrc] = useState("");
    let [images, setImages] = useState<string[]>([]);
    return <label className="block">
        <span className="text-gray-700">Images</span>
        <ul>
            {images.map((src) => (
                <li>
                    <img src={src} />
                    <button onClick={() => {
                        setImages(images.filter((img) => img != src));
                    }}>
                        <X className="size-5" />
                    </button>
                </li>
            ))}
        </ul>
        <div className="flex gap-1">
            <input onInput={(e) => setInputSrc((e.target as any).value)} className="mt-1 block w-full" type="url" />
            <button onClick={() => {
                setImages([...images, inputSrc]);
            }} type="button" className="bg-blue-500 p-2 rounded text-blue-50 cursor-pointer w-full">Ajouter</button>
        </div>
    </label>
}

function AmenitiesInput() {
    const animatedComponents = makeAnimated();

    const amenitiesOptions = amenities.map(a => {
        return {
            icon: a[0],
            value: a[1],
            label: a[1],
        }
    });
    return <label className="block">
        <span className="text-gray-700">Équipements</span>
        <Select
            options={amenitiesOptions}
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
    </label>
}

function LocationInput() {

}