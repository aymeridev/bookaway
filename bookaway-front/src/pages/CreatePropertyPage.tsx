
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import { Banner } from "../components/Banner";
import { BasicInfoStep } from "../components/create_property/steps/BasicInfoStep";
import type { PropertyForm } from "../components/create_property/form";
import { Stepper } from "../components/create_property/Stepper";
import Button from "../components/ui/Button";
import { PropertyTypeStep } from "../components/create_property/steps/PropertyTypeStep";
import { ImagesStep } from "../components/create_property/steps/ImagesStep";
import { AmenitiesStep } from "../components/create_property/steps/AmenitiesStep";
import { PriceStep } from "../components/create_property/steps/PriceStep";



const STEPS = [
    {
        name: "Type de logement",
        description: "",
        Step: PropertyTypeStep,
    },
    {
        name: "Informations de bases",
        description: "contenu",
        Step: BasicInfoStep
    },
    {
        name: "Prix du logement",
        description: "contenu",
        Step: PriceStep,
    },
    {
        name: "Photo du logement",
        description: "contenu",
        Step: ImagesStep
    },
    {
        name: "Équipements",
        description: "contenu",
        Step: AmenitiesStep
    },
] as const;

export function CreateProperyPage() {
    const form = useForm<PropertyForm>({
        defaultValues: {
            amenities: [],
            images: []
        }
    });
    const { handleSubmit } = form;


    const onSubmit: SubmitHandler<PropertyForm> = (data) => {
        const formData = {
            ...data,
            images: data.images.map(img => img.url)
        };
    }
    const [getStep, setStep] = useState(0);

    const Component = STEPS[getStep].Step

    return <>
        <Banner title="Ajouter un logement" description="Remplissez le formulaire ci-dessous pour ajouter un nouveau logement à la plateforme." />
        <form onSubmit={handleSubmit(onSubmit)} action="" className="flex-1 flex gap-8 m-4 max-w-md">

            <Stepper steps={STEPS} currentStep={getStep} />
            <div className="flex-1 rounded-lg shadow-xl p-8 w-full flex-col flex">
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
                        <Button onClick={() => {
                            setStep(getStep + 1)
                        }} type="button" variant="primary">Suivant</Button>}
                </div>}
            </div>
        </form >
    </>
}

