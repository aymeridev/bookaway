import { DayPicker } from "react-day-picker";
import { useLoaderData, useSearchParams } from "react-router"

export function PropertyDetailsPage() {
    const property = useLoaderData();
    return (
        <div className="flex gap-1 p-4">
            <div className="flex flex-col">
                <div className="flex gap-1">
                    <img className="flex-1 rounded-xl" src="https://loremflickr.com/320/240/camping" />
                    <div className="flex flex-col gap-1">
                        <img className="flex-1 rounded-xl" src="https://loremflickr.com/320/240/camping" />
                        <img className="flex-1 rounded-xl" src="https://loremflickr.com/320/240/camping" />

                    </div>
                </div>
                <h3 className="text-3xl font-semibold">{property.title}</h3>
                <p className="text-xl line-clamp-2">{property.description}</p>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-medium">{property.base_price + property.price_per_night * 3}€</span>
                    <span className="text-sm">total pour 3p.</span>
                </div>
            </div>
            <div className="p-4">
                <DayPicker />
            </div>
        </div>
    )
}