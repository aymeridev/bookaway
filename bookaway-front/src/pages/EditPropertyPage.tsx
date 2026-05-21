import { useState } from "react";
import { Banner } from "../components/Banner";
import { PROPERTY_STEPS } from "../components/create_property/form";
import { Stepper } from "../components/create_property/Stepper";

export function EditPropertyPage() {
    const [step, setStep] = useState(0);

    return (
        <>
            <Banner title="Ajouter un logement" description="Remplissez le formulaire ci-dessous pour ajouter un nouveau logement à la plateforme." />
            <Stepper steps={PROPERTY_STEPS} currentStep={step} onChange={() => { }} />

        </>
    )
}