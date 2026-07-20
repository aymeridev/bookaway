import * as z from "zod";

export const propertiesSearchSchema = z.object({
    page: z.coerce.number().default(1),
    travelers: z.coerce.number().min(0).max(99).default(0),
    lat: z.string().default(""),
    lon: z.string().default(""),
    destination: z.string().default(""),
    from: z.string().default(""),
    to: z.string().default(""),
})

export type PropertiesSearchValues = z.infer<typeof propertiesSearchSchema>

export function validatePropertiesSearchParams(searchParams: URLSearchParams): PropertiesSearchValues {
    const params = Object.fromEntries(searchParams);
    console.log(params);
    const res = propertiesSearchSchema.safeParse(params);
    console.log(res)
    if (res.success) {
        return res.data;
    } else {
        return propertiesSearchSchema.parse({});
    }
}