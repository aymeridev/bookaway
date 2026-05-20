import { Search } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Card } from "../../Card";
import { type PropertyForm } from "../form";

export function PropertyLocationStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
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
                        autoComplete="street-address"
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