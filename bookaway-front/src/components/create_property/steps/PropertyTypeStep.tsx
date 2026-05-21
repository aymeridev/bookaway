import type { PropertyFormStepProps } from "../form";
import CampingIllustration from "../../../assets/illustrations/camping.svg";
import HotelIllustration from "../../../assets/illustrations/hotel.svg";
import { t } from "i18next";
import Button from "../../ui/Button";
import { useState } from "react";

const PROPERTIES_TYPES = [
    {
        name: "hotel",
        illustration: HotelIllustration
    },
    {
        name: "camping",
        illustration: CampingIllustration
    },
] as const;

export function PropertyTypeStep({ form, onNext }: PropertyFormStepProps) {
    let [getType, setType] = useState("")
    return (
        <div>
            <h2>Type de logement</h2>
            <p>Quel type de logement souhaitez-vous ajouter ?</p>
            <ul className="flex flex-col gap-4">
                {PROPERTIES_TYPES.map((type) => (
                    <li key={type.name}>
                        <Button
                            onClick={() => {
                                setType(type.name);
                                form.setValue("type", type.name);
                                onNext?.();
                            }}
                            type="button" className="w-full flex-col gap-4" variant="outline">
                            <div className="min-h-32 w-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${type.illustration})` }} aria-hidden="true"></div>
                            <span className="text-xl">{t(type.name)}</span>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}