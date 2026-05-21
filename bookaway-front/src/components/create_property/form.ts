import type { UseFormReturn } from "react-hook-form";
import type { Property } from "../../types";

export type PropertyForm = {
    title: string,
    type: string,
    capacity: string,
    images: { url: string }[],
    amenities: { value: string }[],
    description: string,
    base_price: string,
    price_per_night: string,
    latitude: string,
    longitude: string
}

export interface PropertyFormStepProps {
    onNext?: () => void;
    property?: Property;
    form: UseFormReturn<PropertyForm, any, PropertyForm>
}