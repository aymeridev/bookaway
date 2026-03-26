import { useTranslation } from "react-i18next";

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useState } from "react";
import { fr } from "react-day-picker/locale";
import { format } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";


export function HomePage() {
    const { t } = useTranslation();
    return <main className="flex flex-col relative text-white items-center -z-2 h-full bg-center bg-cover bg-no-repeat justify-center bg" style={{ backgroundImage: "url('background.jpg')" }}>
        <div className="bg-black/50 absolute left-0 top-0 right-0 bottom-0 -z-1"></div>
        <h2 className="text-3xl font-medium">Vos prochaines vacances commencent aujourd'hui</h2>
        <h3>avec BookAway</h3>
        <SearchBar />
    </main>
        ;
}


function SearchBar() {
    return (
        <form className="flex gap-4 items-center justify-center border shadow rounded-xl py-2 px-8 bg-gray-200 border-gray-400 text-gray-900">
            <FormDatePart />
            <div>|</div>
            <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Nombre voyageurs</span>
                <input type="number" min={1} max={16} value={1} />
            </div>
            <input type="submit" className="bg-blue-500 text-blue-50 rounded-full py-1 px-4 font-semibold cursor-pointer" />
        </form>
    )
}

function FormDatePart() {
    const [selected, setSelected] = useState<DateRange>();
    const [openCalendar, setOpenCalendar] = useState(false);

    return <>
        <div className="relative">
            <button type="button" onClick={() => {
                setOpenCalendar(!openCalendar);
            }} className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Date du voyage</span>
                {selected?.from && selected.to ?
                    <span>du {format(selected.from, "d MMM", { locale: fnsFR })} au {format(selected.to, "d MMM", { locale: fnsFR })}</span> :
                    <span>Selectionner une date...</span>}
            </button>
            {openCalendar &&
                <div className="absolute bg-white shadow-xl rounded-xl top-16">

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
                        onSelect={setSelected}
                        locale={fr}
                    />
                </div>
            }

        </div>
    </>
}