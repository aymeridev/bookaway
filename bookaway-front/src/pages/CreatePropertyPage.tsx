
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import { Banner } from "../components/Banner";
import { BasicInfoStep } from "../components/create_property/steps/BasicInfoStep";
import type { PropertyForm } from "../components/create_property/form";
import { Stepper } from "../components/create_property/Stepper";
import Button from "../components/ui/Button";
import { PropertyLocationStep } from "../components/create_property/steps/PropertyLocationStep";
import { PropertyTypeStep } from "../components/create_property/steps/PropertyTypeStep";
import { ImagesStep } from "../components/create_property/steps/ImagesStep";
import { AmenitiesStep } from "../components/create_property/steps/AmenitiesStep";
import { PriceStep } from "../components/create_property/steps/PriceStep";
import { type Property } from "../types";
import api from "../api/axios";



const STEPS = [
    {
        id: "location",
        Step: PropertyLocationStep
    },
    {
        id: "type",
        Step: PropertyTypeStep,
    },
    {
        id: "basic-info",
        Step: BasicInfoStep
    },
    {
        id: "price",
        Step: PriceStep,
    },
    {
        id: "photos",
        Step: ImagesStep
    },
    {
        id: "amenities",
        Step: AmenitiesStep
    },
] as const;

export function CreatePropertyPage() {
    const form = useForm<PropertyForm>({
        defaultValues: {
            amenities: [],
            images: []
        }
    });
    const { handleSubmit } = form;

    const [getProperty, setProperty] = useState<Property>();


    const onSubmit: SubmitHandler<PropertyForm> = (data) => {
        const formData = {
            ...data,
            images: data.images.map(img => img.url)
        };
        console.log(formData);
    }
    const [getStep, setStep] = useState(0);

    const Component = STEPS[getStep].Step

    return <>
        <Banner title="Ajouter un logement" description="Remplissez le formulaire ci-dessous pour ajouter un nouveau logement à la plateforme." />

        <main className="flex p-8 gap-4">
            <Stepper steps={STEPS} currentStep={getStep} />
            <div className="flex-1 rounded-lg shadow-xl p-8 w-full flex-col flex">
                <form onSubmit={handleSubmit(onSubmit)} action="" className="flex-1 flex flex-col gap-8 m-4 max-w-md">
                    <Component form={form} onNext={() => setStep(getStep + 1)} />
                    {getStep > 0 && <div className="flex items-center justify-center">
                        <Button onClick={() => {
                            setStep(getStep - 1)
                        }} type="button" variant="outline">Précedent</Button>
                        <span className="flex-1 text-center">Étape {getStep + 1}/{STEPS.length}</span>

                        {getStep === STEPS.length - 1 ?
                            <Button>
                                Créer le logement
                            </Button> :
                            <Button onClick={async () => {
                                const stepId = STEPS[getStep].id;
                                switch (stepId) {
                                    case "basic-info":
                                        const values = form.getValues();
                                        console.log(values);
                                        await api.post("/properties", values);
                                        setStep(getStep + 1);
                                        break;
                                        _:
                                        setStep(getStep + 1)
                                        break;
                                }
                            }} type="button" variant="primary">Suivant</Button>}
                    </div>}
                </form >
            </div>
        </main>
    </>
}

