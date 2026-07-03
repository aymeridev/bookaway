import { useParams, useNavigate } from "react-router";
import { PropertyCard } from "./SearchPage";
import Button from "../components/ui/Button";
import { useUserProfile, useUserProperties } from "../hooks/apiHooks";
import { Loader2 } from "lucide-react";

export function UserPage() {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: isUserLoading } = useUserProfile(id);
    const { data: propertiesData, isLoading: isPropertiesLoading } = useUserProperties(id);
    const properties = propertiesData || [];
    const navigate = useNavigate();

    if (isUserLoading || isPropertiesLoading || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Chargement du profil...</p>
            </div>
        );
    }

    return (
        <>
            <Button variant="flat" onClick={() => navigate(-1)}>Retour</Button>
            <h1 className="text-title-large">Profil</h1>
            <div aria-hidden="true" className="rounded-full size-32 mx-auto" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${user?.id}")` }}></div>
            {properties.length > 0 && (
                <>
                    <h2 className="text-title-medium">Les annonces de {user.name}</h2>
                    <div className="flex">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} numberOfNights={0}></PropertyCard>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}