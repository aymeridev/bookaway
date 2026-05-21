import type { UseFormReturn } from "react-hook-form";
import type { Property } from "../../types";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { PriceStep } from "./steps/PriceStep";
import { AmenitiesStep } from "./steps/AmenitiesStep";
import { ImagesStep } from "./steps/ImagesStep";

export type PropertyForm = {
    title: string,
    type: string,
    capacity: string,
    images: { id: string; sort_order: number; url: string }[],
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

export const PROPERTY_STEPS = [
    {
        id: "basic-info",
        Step: BasicInfoStep
    },
    {
        id: "price",
        Step: PriceStep,
    },
    {
        id: "amenities",
        Step: AmenitiesStep
    },
    {
        id: "photos",
        Step: ImagesStep
    }
] as const