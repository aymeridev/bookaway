import { useTranslation } from "react-i18next";

export function HomePage() {
    const { t } = useTranslation();
    return <main className="flex flex-col items-center justify-center bg-hero">
        <h2 className="text-3xl font-medium">Vos prochaines vacances commencent aujourd'hui</h2>
        <h3>avec BookAway</h3>
        <SearchBar />
    </main>
        ;
}


function SearchBar() {
    return (
        <form className="flex gap-4 items-center justify-center border shadow rounded-xl py-2 px-8 bg-gray-200 border-gray-400">
            <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Date du voyage</span>
                <input type="text" value={"du ... au ..."} readOnly />
            </div>
            <div>|</div>
            <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Nombre voyageurs</span>
                <input type="number" min={1} max={16} value={1} />
            </div>
            <input type="submit" className="bg-blue-500 text-blue-50 rounded-full py-1 px-4 font-semibold cursor-pointer" />
        </form>
    )
}