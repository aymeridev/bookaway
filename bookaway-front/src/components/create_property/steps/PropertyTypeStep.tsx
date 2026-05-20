import type { UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
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


interface PropertyTypeStepProps {
    onNext?: () => void;
    form: UseFormReturn<PropertyForm, any, PropertyForm>
}

export function PropertyTypeStep({ form, onNext }: PropertyTypeStepProps) {
    let [getType, setType] = useState("")
    return (
        <div>
            <h2>Type de logement</h2>
            <p>Quel type de logement souhaitez-vous ajouter ?</p>
            <input type="hidden" name="type" value={getType} />
            <ul className="flex flex-col gap-4">
                {PROPERTIES_TYPES.map((type, index) => (
                    <li>
                        <Button
                            onClick={() => {
                                setType(type.name);
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