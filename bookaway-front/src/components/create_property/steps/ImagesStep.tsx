import { type UseFormReturn } from "react-hook-form";
import type { PropertyForm } from "../form";
import { useDropzone } from 'react-dropzone';

export function ImagesStep({ form: _form }: { form: UseFormReturn<PropertyForm, any, PropertyForm> }) {
    // const { register, control } = form;
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "images"
    // });

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
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

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <section className="bg-gray-200 border-4 border-dashed rounded-xl border-gray-600 p-4">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <em>(Only *.jpeg and *.png images will be accepted)</em>
            </div>
            <aside>
                <h4>Accepted files</h4>
                <ul>{acceptedFileItems}</ul>
                <h4>Rejected files</h4>
                <ul>{fileRejectionItems}</ul>
            </aside>
        </section>
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