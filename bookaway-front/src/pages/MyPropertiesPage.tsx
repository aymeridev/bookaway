import { PlusCircle } from "lucide-react";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import { useLoaderData, useNavigate } from "react-router";
import type { Property } from "../types";

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

            <ul>
                {properties.map((property) => (
                    <li key={property.id}>{property.title}</li>
                ))}
            </ul>
        </main>
    </>
}