import { PlusCircle } from "lucide-react";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import { useLoaderData, useNavigate } from "react-router";
import type { Property } from "../types";
import { PropertyCard } from "./SearchPage";

export function MyPropertiesPage() {
    const properties: Property[] = useLoaderData();
    const navigate = useNavigate();
    return <>
        <Banner title="Mes logements" />
        <main>
            <Button onClick={() => {
                navigate("/new-property", {
                    viewTransition: true
                })
            }}>
                <PlusCircle />
                Nouveau logement</Button>

            <hr />

            <ul className="grid grid-cols-4 gap-2">
                {properties.map((property) => (
                    <li key={property.id}>
                        <PropertyCard property={property} numberOfNights={0} />
                    </li>
                ))}
            </ul>
        </main>
    </>
}