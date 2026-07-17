import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
import { useDropzone } from 'react-dropzone';
import toast from "react-hot-toast";
import api from "../../../api/axios";
import type { Property } from "../../../types";
import { GripHorizontal, ImageDown, X } from "lucide-react";

export function ImagesStep({ form, property }: { form: UseFormReturn<PropertyForm, any, PropertyForm>, property: Property }) {
    const { control } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "images"
    });

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        multiple: false,
        onDrop: async (acceptedFiles, fileRejections, event) => {
            console.log(acceptedFiles, fileRejections, event);

            const formData = new FormData();

            formData.append("image", acceptedFiles[0]);

            try {
                const res = await api.post(`/properties/${property.id}/images`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                console.log(res);
                append(res.data.image);

                toast.success(res.data.message);
            } catch (err) {
                console.error(err);
                toast.error("erreur");
            }
        },
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    });


    return (
        <>
            <div {...getRootProps({ className: 'bg-gray-200 border-4 border-dashed rounded-xl border-gray-600 p-4 dropzone aspect-video max-w-sm flex items-center justify-center flex-col' })}>
                <input {...getInputProps()} />
                <ImageDown className="animate-pulse size-12" />
                <p className="text-lg font-semibold">Glisser-déposer des images ou cliquer pour les sélectionner</p>
                <em className="text-sm font-medium text-gray-700">(Seuls les fichiers *.jpeg et *.png sont acceptés)</em>
            </div>
            <h2>Images mises en ligne</h2>
            {fields.length > 0 &&
                <ul>
                    {[...fields].sort((a, b) => a.sort_order - b.sort_order).map((field) => {
                        const originalIndex = fields.findIndex((f) => f.id === field.id);
                        const dbId = form.getValues("images")[originalIndex]?.id;

                        return (
                            <li className="flex gap-2 items-center justify-center" draggable key={field.id}>
                                <GripHorizontal />
                                <div className="aspect-video bg-center bg-cover rounded w-32" style={{ backgroundImage: `url(${field.url})` }} />
                                <button className="btn btn-ghost" onClick={async () => {
                                    if (dbId) {
                                        await api.delete(`/properties/${property.id}/images/${dbId}`);
                                    }
                                    remove(originalIndex);
                                }}><X /></button>
                            </li>
                        );
                    })}
                </ul>
            }
        </>
    );

    // return <Card>
    //     <label className="block">
    //         <span className="text-gray-700">Images</span>
    //         <ul>
    //             {fields.map((field, index) => (
    //                 <li key={field.id}>
    //                     <input type="url" placeholder="https://..."
    //                         {...register(`images.${index}.url` as const)}
    //                     />
    //                     <button type="button" onClick={() => remove(index)}>
    //                         <X className="size-5" />
    //                     </button>
    //                 </li>
    //             ))}
    //         </ul>
    //         <div className="flex gap-1">
    //             <button onClick={() => append({ url: "" })}
    //                 type="button"
    //                 className="bg-blue-500 p-2 rounded text-blue-50 cursor-pointer w-full">
    //                 Ajouter
    //             </button>
    //         </div>
    //     </label>
    // </Card>;
}