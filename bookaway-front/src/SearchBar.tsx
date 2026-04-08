import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useState, type SubmitEvent } from "react";
import { fr } from "react-day-picker/locale";
import { format } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";
import { useNavigate } from "react-router";
import { Map, Minus, Plus, Search, Users } from "lucide-react";

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
        <form onSubmit={handleSubmit} className="flex gap-4 items-center justify-center border shadow rounded-xl py-2 px-8 bg-gray-200 border-gray-400 text-gray-900">
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <Map />
                <div className="flex flex-col">
                    <span className="font-bold text-sm">Destination</span>
                    <input type="text" placeholder="Rechercher une destination" />
                </div>
            </div>
            <div className="select-none text-gray-400 font-extralight">|</div>
            <FormDatePart selected={selectedDate} onSelect={setSelectedDate} />
            <div className="select-none text-gray-400 font-extralight">|</div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <Users />
                <div className="flex flex-col">
                    <span className="font-bold text-sm">Voyageurs</span>
                    <div className="flex gap-4 items-center justify-center">
                        <button className="p-1 text-gray-800 bg-gray-200 cursor-pointer rounded-full"><Minus /></button>
                        <span>{travelers}</span>
                        <button className="p-1 text-gray-800 bg-gray-200 cursor-pointer rounded-full"><Plus /></button>
                    </div>
                </div>
            </div>
            <button className="bg-blue-500 text-blue-50 rounded-full p-4 font-semibold cursor-pointer">
                <Search />
            </button>
        </form>
    )
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