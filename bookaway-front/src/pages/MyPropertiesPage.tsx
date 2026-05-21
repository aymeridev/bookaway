import { PlusCircle } from "lucide-react";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router";

export function MyPropertiesPage() {
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

            <ul></ul>
        </main>
    </>
}