import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useState, type SubmitEvent } from "react";
import { fr } from "react-day-picker/locale";
import { format } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";
import { useNavigate } from "react-router";
import { Map, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { useDebounce } from "./hooks/useDebounce";

export function SearchBar() {
    const [travelers, setTravelers] = useState(1);
    const [selectedDate, setSelectedDate] = useState<DateRange>();
    const navigate = useNavigate();

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const params = new URLSearchParams({
            travelers: travelers.toString(),
            from: selectedDate?.from ? format(selectedDate.from, "yyyy-MM-dd") : "",
            to: selectedDate?.to ? format(selectedDate.to, "yyyy-MM-dd") : ""
        });

        navigate(`/search?${params.toString()}`, {
            viewTransition: true
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 items-center justify-center rounded-full border shadow py-2 px-2 bg-gray-100 border-gray-300 text-gray-900 [view-transition-name:search-bar]">
            <FormDestinationPart />
            <div className="select-none text-gray-400 font-extralight">|</div>
            <FormDatePart selected={selectedDate} onSelect={setSelectedDate} />
            <div className="select-none text-gray-400 font-extralight">|</div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <Users className="text-gray-600" />
                <div className="flex flex-col">
                    <span className="font-bold text-sm">Voyageurs</span>
                    <div className="flex gap-4 items-center justify-center">
                        <button onClick={() => {
                            setTravelers(Math.max(travelers - 1, 1))

                        }} className="p-1 text-gray-800 bg-gray-200 cursor-pointer rounded-full" type="button"><Minus /></button>
                        <span>{travelers}</span>
                        <button onClick={() => {
                            setTravelers(travelers + 1)
                        }} className="p-1 text-gray-800 bg-gray-200 cursor-pointer rounded-full" type="button"><Plus /></button>
                    </div>
                </div>
            </div>
            <button className="bg-blue-500 text-blue-50 rounded-full p-4 font-semibold cursor-pointer">
                <Search />
            </button>
        </form>
    )
}

function FormDestinationPart() {
    const [location, setLocation] = useState<[string, string]>(["", ""]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        async function load() {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&email=ulco@ulco.fr`);

            const data = await res.json();
            console.log(data);
            setResults(data);
        }
        if (debouncedSearch) {
            console.log(debouncedSearch);
            load()
        }
    }, [debouncedSearch]);

    return <div className="relative">
        <input type="hidden" defaultValue={location[0]} readOnly name="latitude" />
        <input type="hidden" defaultValue={location[1]} readOnly name="longitude" />
        <div className="flex items-center justify-center gap-2  px-4 py-2 rounded-xl">
            <Map className="text-gray-600" />
            <div className="flex flex-col">
                <span className="font-bold text-sm">Destination</span>
                <input className="border-none" value={search} onChange={(e) => {
                    setSearch(e.target.value);
                }} type="text" placeholder="Rechercher une destination" />
            </div>
        </div>
        {results.length > 0 && <div className="absolute bg-white rounded-xl min-w-lg shadow-2xl p-4">
            <span className="text-sm text-gray-600">Résultats de recherches</span>
            <ul className="flex w-full flex-col gap-1">
                {results.map((result: any) => (
                    <li key={result.place_id} className="w-full">
                        <button onClick={() => {
                            setLocation([result.lat, result.lon]);
                            setSearch(result.name)
                            setResults([]);
                        }} className="cursor-pointer w-full flex items-center gap-1 hover:bg-gray-100 rounded-xl p-2" type="button">
                            <div className="size-16 flex items-center justify-center text-red-600 bg-red-100 rounded-xl">
                                <MapPin className="size-8" strokeWidth={1} />
                            </div>
                            <div className="flex flex-col items-start">
                                {result.name}
                                <span className="text-gray-700 text-xs text-left">{result.display_name}</span>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>}
    </div>

}

function FormDatePart({ selected, onSelect }: { selected: DateRange | undefined, onSelect: (d: DateRange | undefined) => void }) {
    const [openCalendar, setOpenCalendar] = useState(false);

    return <>
        <div className="relative">
            <button type="button" onClick={() => {
                setOpenCalendar(!openCalendar);
            }} className="flex items-start flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Dates</span>
                {selected?.from && selected.to ?
                    <span>{format(selected.from, "d MMM", { locale: fnsFR })} - {format(selected.to, "d MMM", { locale: fnsFR })}</span> :
                    <span>Quand ?</span>}
            </button>
            {openCalendar &&
                <div className="absolute bg-white shadow-xl rounded-xl top-16 z-50">
                    <DayPicker
                        animate
                        captionLayout="dropdown"
                        mode="range"
                        navLayout="around"
                        resetOnSelect
                        showOutsideDays
                        showWeekNumber
                        timeZone="Europe/Paris"
                        selected={selected}
                        onSelect={onSelect}
                        locale={fr}
                    />
                </div>
            }
        </div>
    </>
}