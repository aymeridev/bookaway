// fonction utilitaire pour filtrer les chaines vides
export function objectToSearchParams<T extends Record<string, any>>(obj: T): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    })

    return params;
}