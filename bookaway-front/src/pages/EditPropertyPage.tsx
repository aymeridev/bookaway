import { useState } from "react";
import { Banner } from "../components/Banner";
import { PROPERTY_STEPS, type PropertyForm } from "../components/create_property/form";
import { useForm } from "react-hook-form";
import type { Property } from "../types";
import { useParams, useNavigate } from "react-router";
import { Card } from "../components/Card";
import Button from "../components/ui/Button";
import { Save, Loader2 } from "lucide-react";
import { StepperList } from "../components/create_property/StepperList";
import api from "../api/axios";
import { usePropertyDetails } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";

export function EditPropertyPage() {
    const { id } = useParams<{ id: string }>();
    const { data: property, isLoading } = usePropertyDetails(id);

    if (isLoading || !property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Chargement des données du logement...</p>
            </div>
        );
    }

    return <EditPropertyForm property={property} />;
}

interface EditPropertyFormProps {
    property: Property;
}

function EditPropertyForm({ property }: EditPropertyFormProps) {
        const { t } = useTranslation();
    const form = useForm<PropertyForm>({
        defaultValues: {
            title: property.title || "",
            type: property.type || "",
            description: property.description || "",
            capacity: String(property.capacity ?? ""),
            base_price: String(property.base_price ?? ""),
            price_per_night: String(property.price_per_night ?? ""),
            latitude: String(property.latitude ?? ""),
            longitude: String(property.longitude ?? ""),
            images: (property.images || []).map(img => ({
                id: String(img.id),
                sort_order: img.sort_order,
                url: img.url
            })),
            amenities: (property.amenities || []).map(a => ({ value: a })),
        }
    });

    const [step, setStep] = useState(0);

    const CurrentStep = PROPERTY_STEPS[step].Step;

    const navigate = useNavigate();
    return (
        <>
            <Banner title="Modifier le logement" />
            <main className="flex p-8">
                <StepperList steps={PROPERTY_STEPS} currentStep={step} onChange={(stepIndex) => {
                    setStep(stepIndex)
                }} />
                <Card className="flex-1">
                    <CurrentStep form={form} property={property} />
                    <Button>
                        <Save />
                        {t("accommodation-edit.save")}
                    </Button>
                    <Button onClick={() => {
                        if (confirm(t("accommodation-edit.delete-confirm"))) {
                            api.delete(`/properties/${property.id}`);
                            navigate("/my-properties");
                        }
                    }} variant="danger">{t("accommodation-edit.delete")}</Button>
                </Card>
            </main>
        </>
    )
}