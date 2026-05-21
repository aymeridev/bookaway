
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import { Banner } from "../components/Banner";
import { PROPERTY_STEPS, type PropertyForm } from "../components/create_property/form";
import { Stepper } from "../components/create_property/Stepper";
import Button from "../components/ui/Button";
import { PropertyLocationStep } from "../components/create_property/steps/PropertyLocationStep";
import { PropertyTypeStep } from "../components/create_property/steps/PropertyTypeStep";
import { type Property } from "../types";
import api from "../api/axios";
import toast from "react-hot-toast";



const STEPS = [
    {
        id: "location",
        Step: PropertyLocationStep
    },
    {
        id: "type",
        Step: PropertyTypeStep,
    },
    ...PROPERTY_STEPS
] as const;

export function CreatePropertyPage() {
    const form = useForm<PropertyForm>({
        defaultValues: {
            amenities: [],
            images: []
        }
    });
    const { handleSubmit } = form;

    const [property, setProperty] = useState<Property>();


    const onSubmit: SubmitHandler<PropertyForm> = (data) => {
        const formData = {
            ...data,
            images: data.images.map(img => img.url)
        };
        console.log(formData);
    }
    const [step, setStep] = useState(0);

    const [isLoading, setLoading] = useState(false);

    const Component = STEPS[step].Step

    return <>
        <Banner title="Ajouter un logement" description="Remplissez le formulaire ci-dessous pour ajouter un nouveau logement à la plateforme." />

        <main className="flex p-8 gap-4">
            <Stepper steps={STEPS} currentStep={step} />
            <div className="flex-1 rounded-lg shadow-xl p-8 w-full flex-col flex">
                <form onSubmit={handleSubmit(onSubmit)} action="" className="flex-1 flex flex-col gap-8 m-4 max-w-md">
                    <Component property={property!} form={form} onNext={() => setStep(step + 1)} />
                    {step > 0 && <div className="flex items-center justify-center">
                        <Button onClick={() => {
                            setStep(step - 1)
                        }} type="button" variant="outline">Précedent</Button>
                        <span className="flex-1 text-center">Étape {step + 1}/{STEPS.length}</span>

                        {step === STEPS.length - 1 ?
                            <Button>
                                Créer le logement
                            </Button> :
                            <Button isLoading={isLoading} onClick={async () => {
                                const stepId = STEPS[step].id;
                                switch (stepId) {
                                    case "amenities":
                                        if (property === undefined) {
                                            const values = form.getValues();
                                            console.log(values);
                                            try {
                                                setLoading(true);
                                                const res = await api.post<Property>("/properties", {
                                                    ...values,
                                                    amenities: values.amenities.map((a) => a.value)
                                                });

                                                setProperty(res.data)
                                                setStep(step + 1);
                                            } catch (err) {
                                                console.error(err);
                                                toast.error("Erreur lors de la création du logement");
                                            }
                                            setLoading(false);
                                        } else {
                                            setStep(step + 1)
                                        }
                                        break;
                                    default:
                                        setStep(step + 1)
                                        break;
                                }
                            }} type="button" variant="primary">Suivant</Button>}
                    </div>}
                </form >
            </div>
        </main>
    </>
}

