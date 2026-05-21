import { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { Link, useLoaderData, useSearchParams, useNavigate } from "react-router";
import { differenceInDays, parseISO, eachDayOfInterval } from "date-fns"; 
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { fr } from 'react-day-picker/locale';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import type { Property } from '../types';

export function PropertyDetailsPage() {
    const property: Property = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");

    // Extraction et formatage des dates bloquées pour l'affichage visuel (grisé)
    const disabledDays = [
        { before: new Date() },
        ...(property.bookings || []).map((booking: any) => ({
            from: parseISO(booking.start_date),
            to: parseISO(booking.end_date)
        }))
    ];

    // Gestion de l'état des dates sélectionnées
    const [range, setRange] = useState<DateRange | undefined>(() => {
        if (urlFrom && urlTo) {
            return {
                from: parseISO(urlFrom),
                to: parseISO(urlTo)
            };
        }
        return undefined; 
    });
    const [month, setMonth] = useState<Date>(range?.from || new Date());

    // Fonction de sécurité pour empêcher de sélectionner une plage qui englobe des dates réservées
    const handleSelectRange = (newRange: DateRange | undefined) => {
        // Si la plage est incomplète (uniquement la date de début sélectionnée)
        if (!newRange?.from || !newRange?.to) {
            setRange(newRange);
            return;
        }

        // 1. Génère la liste de tous les jours inclus dans la sélection demandée
        const selectedDays = eachDayOfInterval({
            start: newRange.from,
            end: newRange.to
        });

        // 2. Vérifie si l'un de ces jours entre en conflit avec une réservation existante
        const hasBlockedDay = selectedDays.some(day => {
            return (property.bookings || []).some((booking: any) => {
                const start = parseISO(booking.start_date);
                const end = parseISO(booking.end_date);
                
                // Remise à zéro des heures pour comparer uniquement la date pure
                const d = new Date(day).setHours(0,0,0,0);
                const s = new Date(start).setHours(0,0,0,0);
                const e = new Date(end).setHours(0,0,0,0);

                return d >= s && d <= e;
            });
        });

        if (hasBlockedDay) {
            alert("Désolé, cette plage de dates contient des jours déjà réservés.");
            // On réinitialise la sélection en gardant uniquement le premier clic comme point de départ
            setRange({ from: newRange.from, to: undefined });
        } else {
            // Tout est valide, on enregistre la plage
            setRange(newRange);
        }
    };

    // Calcul du nombre de nuits basé sur la sélection réelle
    const numberOfNights = range?.from && range?.to
        ? differenceInDays(range.to, range.from)
        : 0;

    const basePrice = property.base_price || 0;
    const pricePerNight = property.price_per_night || 0;
    const nightsTotal = pricePerNight * numberOfNights;
    const grandTotal = basePrice + nightsTotal;

    const images: GalleryItem[] = property.images.map(img => ({
        original: img,
        thumbnail: img
    }));
    const galleryRef = useRef<ImageGalleryRef>(null);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <Button
                variant="flat"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft />
                Retour aux résultats
            </Button>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 h-[450px] gap-3 overflow-hidden rounded-2xl">
                <div className="w-full h-full">
                    <ImageGallery
                        ref={galleryRef}
                        items={images}
                        onSlide={(index) => console.log("Slid to", index)}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Colonne de gauche : Infos & Map */}
                <div className="flex-[2] space-y-8">
                    <div className="border-b pb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">À propos de ce logement</h2>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Où se situe le logement</h2>
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <PropertyLocation longitude={parseFloat(property.longitude)} latitude={parseFloat(property.latitude)} />
                        </div>
                    </div>
                </div>

                {/* Colonne de droite : Widget Réservation (Sticky) */}
                <div className="flex-1">
                    <div className="sticky top-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <span className="text-2xl font-bold">{property.price_per_night}€</span>
                                <span className="text-gray-500"> / nuit</span>
                            </div>
                        </div>

                        <div className="flex justify-center bg-gray-50 rounded-xl p-2 border border-gray-100">
                            <DayPicker
                                mode="range"
                                selected={range}
                                onSelect={handleSelectRange}
                                disabled={disabledDays}
                                month={month}
                                locale={fr}
                                onMonthChange={setMonth}
                                className="m-0"
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-gray-600">
                                <span className="underline">{property.price_per_night}€ x {numberOfNights} nuits</span>
                                <span>{nightsTotal}€</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="underline">Frais de service</span>
                                <span>{basePrice}€</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{grandTotal}€</span>
                            </div>
                        </div>

                        <Link
                            to="/reservation"
                            state={{
                                property,
                                dateRange: {
                                    from: range?.from?.toISOString(),
                                    to: range?.to?.toISOString()
                                },
                                totals: { numberOfNights, nightsTotal, basePrice, grandTotal }
                            }}
                            className={`block w-full text-center py-4 text-white font-bold rounded-xl transition-all ${numberOfNights > 0
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed pointer-events-none'
                                }`}
                        >
                            {numberOfNights > 0 ? 'Réserver maintenant' : 'Sélectionnez vos dates'}
                        </Link>

                        <p className="text-center text-xs text-gray-400">Aucun montant ne vous sera débité pour le moment</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyLocation({ longitude, latitude }: { longitude: number, latitude: number }) {
    return <div className='h-96 w-full'>
        <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} />
        </MapContainer>
    </div>
}