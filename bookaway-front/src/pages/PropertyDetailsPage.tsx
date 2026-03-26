import { useSearchParams } from "react-router"

export function PropertyDetailsPage() {
    const property = useSearchParams();
    return (
        <>
            {property.title}
        </>
    )
}