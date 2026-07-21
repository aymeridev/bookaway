import { useTranslation } from "react-i18next";
import type { Property } from "../../types";
import { Link, useSearchParams } from "react-router";
import { amenitiesIcon } from "../../amenities";
import { StarIcon } from "@phosphor-icons/react";
import type { Ref } from "react";

interface SearchPropertyCardResultProps {
    property: Property;
    focus?: boolean;
    numberOfNights: number;
    onPointerEnter?: () => void;
    ref?: Ref<HTMLAnchorElement>
}

export function SearchPropertyCardResult({
    property, focus, numberOfNights, ref,
    onPointerEnter
}: SearchPropertyCardResultProps) {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    console.log(numberOfNights);

    const pricesMap = property.units.map((u) => u.price_per_night);

    const priceRange = [Math.min(...pricesMap), Math.max(...pricesMap)];

    const url = (from && to) ? `/property/${property.id}?from=${from}&to=${to}` : `/property/${property.id}`;
    return (
        <Link
            ref={ref}
            to={url}
            className={`group w-full block card hover:bg-base-300 hover:text-primary transition-colors bg-base-200 shadow-sm ${focus && "ring-4 bg-primary/25 ring-primary"}`}
            onPointerEnter={onPointerEnter}
        >
            <figure className="relative">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={property.images[0].url}
                    alt={property.title}
                />
                {property.user && (
                    <div
                        className="absolute bottom-4 tooltip tooltip-left right-4 avatar"
                        data-tip={property.user.name}
                    >
                        <div className="w-8 rounded-full">
                            <img
                                src={`https://api.dicebear.com/10.x/thumbs/svg?seed=${property.user.id}`}
                                alt={property.user.name}
                                className="w-full h-full object-cover"
                            />

                        </div>
                    </div>
                )}
            </figure>

            <div className="card-body">
                <div className="flex items-center">
                    <h2 className="card-title flex-1">{property.title}</h2>
                    {property.ratings_avg !== null && property.ratings_avg !== undefined ? (
                        <span className="badge">
                            <StarIcon weight="fill" className="text-yellow-500 size-4" />
                            <span>{property.ratings_avg}</span>
                            <span className="text-base-content/80 text-xs">({property.ratings?.length || 0})</span>
                        </span>
                    ) : (
                        <span className="badge badge-soft badge-accent">
                            Nouveau
                        </span>
                    )}

                </div>
                <p>{property.description}</p>

                <div className="flex flex-col flex-1 justify-between">
                    <div className="space-y-2">
                        {property.distance !== undefined && (
                            <span className="badge badge-soft badge-primary">
                                À {Number(property.distance).toFixed(1)} km de votre point de recherche
                            </span>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity) => {
                                const Icon = amenitiesIcon[amenity];
                                return (
                                    <span key={amenity} className="badge">
                                        {Icon && <Icon className="size-4" />}
                                        {t(`amenities.${amenity}` as any)}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                    <span className="underline tracking-wide font-semibold">
                        {property.units.length > 1 ? `${priceRange[0] / 100}-${priceRange[1] / 100}€/nuit` : `${property.units[0].price_per_night}€ par nuit`}
                    </span>
                </div>
            </div>
        </Link>
    );
}