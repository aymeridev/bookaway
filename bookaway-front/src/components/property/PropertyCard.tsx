import { useTranslation } from "react-i18next";
import type { Property } from "../../types";
import { Link, useSearchParams } from "react-router";
import { amenitiesIcon } from "../../amenities";
import { StarIcon } from "@phosphor-icons/react";

export function PropertyCard({
    property, numberOfNights
}: {
    property: Property;
    numberOfNights: number;
}) {
    const { t } = useTranslation();
    const totalPrice =
        property.base_price + property.price_per_night * numberOfNights;
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const url = (from && to) ? `/property/${property.id}?from=${from}&to=${to}` : `/property/${property.id}`;
    return (
        <Link
            to={url}
            className="group max-w-xl block"
        >
            <article className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative w-full aspect-video shrink-0 overflow-hidden">
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={property.images[0].url}
                        alt={property.title}
                    />
                    {property.user && (
                        <div
                            className="absolute bottom-3 right-3 z-10 size-10 rounded-full border-2 border-white dark:border-base-300 shadow-md overflow-hidden bg-white hover:scale-110 transition-transform duration-300"
                            title={`Hôte: ${property.user.name}`}
                        >
                            <img
                                src={`https://api.dicebear.com/10.x/thumbs/svg?seed=${property.user.id}`}
                                alt={property.user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 p-5 justify-between">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
                                {property.title}
                            </h3>
                            {property.ratings_avg !== null && property.ratings_avg !== undefined ? (
                                <div className="flex items-center gap-1 shrink-0 text-sm font-bold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100/80 hover:bg-yellow-50/50 transition-colors">
                                    <StarIcon className="size-4 text-yellow-500 fill-yellow-500" />
                                    <span>{property.ratings_avg}</span>
                                    <span className="text-gray-400 font-normal text-xs">({property.ratings?.length || 0})</span>
                                </div>
                            ) : (
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50/50 border border-blue-100/50 px-2 py-0.5 rounded-lg shrink-0">
                                    Nouveau
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                            {property.description}
                        </p>

                        {property.distance !== undefined && (
                            <p className="text-sm text-blue-600 font-medium">
                                {t("search.card-distance", { distance: Number(property.distance).toFixed(1) })}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity) => {
                                const Icon = amenitiesIcon[amenity];
                                return (
                                    <span key={amenity} className="flex items-center gap-1 px-2 py-1">
                                        {Icon && <Icon />}
                                        {t(`amenities.${amenity}` as any)}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                        {numberOfNights > 0 && (
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-extrabold text-gray-900">
                                        {totalPrice}€
                                    </span>

                                    <span className="text-gray-500 text-xs">
                                        {t("search.card-per-night", { count: numberOfNights })}
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </article>
        </Link>
    );
}