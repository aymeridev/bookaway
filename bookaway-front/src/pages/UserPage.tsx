import { useLoaderData } from "react-router";
import type { Property, User } from "../types";
import { PropertyCard } from "./SearchPage";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router";

export function UserPage() {
    const { user, properties } = useLoaderData() as { user: User, properties: Property[] };
    const navigate = useNavigate();

    return (
        <>
            <Button variant="flat" onClick={() => navigate(-1)}>Retour</Button>
            <h1 className="text-title-large">Profil</h1>
            {properties.length > 0 && (
                <>
                    <h2 className="text-title-medium">Les annonces de {user.name}</h2>
                    <div className="flex">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} numberOfNights={0}></PropertyCard>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}