import { Wifi } from 'lucide';

const AMENITIES = {
    wifi: {
        icon: Wifi,
        name: "Wifi Gratuit",
    }
} as const;

export function AmenitiesList({ amunities: amenities }: { amunities: string[] }) {
    return <ul>
        {amenities.map((amenity: string) => (
            <li>
                {amenity}
            </li>
        ))}
    </ul>
}