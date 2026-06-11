import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export function RateProperyPage() {
    return (
        <>
            <Banner title="Noter un logement" />
            <main>
                <div className="flex w-min">
                    <Input min={1} max={5} placeholder="..." type="number" className="text-xl min-w-20" />
                    <span className="text-xl">/5</span>
                </div>
                <Input placeholder="Commentaire" />
                <Button>Noter</Button>
            </main>
        </>
    )
}