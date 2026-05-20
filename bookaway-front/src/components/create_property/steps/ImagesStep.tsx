import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Card } from "../../Card";
import type { PropertyForm } from "../form";
import { X } from "lucide-react";

export function ImagesStep({ form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    const { register, control } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "images"
    });

    return <Card>
        <label className="block">
            <span className="text-gray-700">Images</span>
            <ul>
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <input type="url" placeholder="https://..."
                            {...register(`images.${index}.url` as const)}
                        />
                        <button type="button" onClick={() => remove(index)}>
                            <X className="size-5" />
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex gap-1">
                <button onClick={() => append({ url: "" })}
                    type="button"
                    className="bg-blue-500 p-2 rounded text-blue-50 cursor-pointer w-full">
                    Ajouter
                </button>
            </div>
        </label>
    </Card>;
}