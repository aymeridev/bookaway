import { type UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
import { useDropzone } from 'react-dropzone';
import toast from "react-hot-toast";
import api from "../../../api/axios";
import type { ApiResponse, PropertyImage, Property } from "../../../types";
import { useState } from "react";
import { GripHorizontal } from "lucide-react";

export function ImagesStep({ form: _form, property }: { form: UseFormReturn<PropertyForm, any, PropertyForm>, property: Property }) {
    // const { register, control } = form;
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "images"
    // });

    const [images, setImages] = useState<PropertyImage[]>([]);

    const {
        acceptedFiles,
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
                setImages([
                    ...images,
                    res.data.image
                ])

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

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));


    return (
        <>
            <section className="bg-gray-200 border-4 border-dashed rounded-xl border-gray-600 p-4">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                    <em>(Only *.jpeg and *.png images will be accepted)</em>
                </div>
            </section>
            {images &&
                <ul>
                    {images.sort((a, b) => a.sort_order - b.sort_order).map(({ id, path }) => (
                        <li key={id}>
                            <GripHorizontal />
                            {path}
                        </li>
                    ))}
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