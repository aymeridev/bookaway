import { useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { Link, useLoaderData, useSearchParams, useNavigate } from "react-router";
import { differenceInDays, parseISO, eachDayOfInterval, formatDate } from "date-fns";
import Button from '../components/ui/Button';
import { ArrowLeft, Map, SquarePen, Star } from 'lucide-react';
import { fr } from 'react-day-picker/locale';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import type { Property } from '../types';
import { Card } from '../components/Card';
import useAuthStore from '../context/AuthStore';
import { frCA } from 'date-fns/locale';

export function PropertyDetailsPage() {
    const property: Property = useLoaderData();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const isOwner = user?.id === property.user_id;

    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");

    const disabledDays = [
        { before: new Date() },
        ...(property.bookings || []).map((booking: any) => ({
            from: parseISO(booking.start_date),
            to: parseISO(booking.end_date)
        }))
    ];

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

    const handleSelectRange = (newRange: DateRange | undefined) => {
        if (!newRange?.from || !newRange?.to) {
            setRange(newRange);
            return;
        }

        const selectedDays = eachDayOfInterval({
            start: newRange.from,
            end: newRange.to
        });

        const hasBlockedDay = selectedDays.some(day => {
            return (property.bookings || []).some((booking: any) => {
                const start = parseISO(booking.start_date);
                const end = parseISO(booking.end_date);

                const d = new Date(day).setHours(0, 0, 0, 0);
                const s = new Date(start).setHours(0, 0, 0, 0);
                const e = new Date(end).setHours(0, 0, 0, 0);

                return d >= s && d <= e;
            });
        });

        if (hasBlockedDay) {
            alert("Désolé, cette plage de dates contient des jours déjà réservés.");
            setRange({ from: newRange.from, to: undefined });
        } else {
            setRange(newRange);
        }
    };

    const numberOfNights = range?.from && range?.to
        ? differenceInDays(range.to, range.from)
        : 0;

    const basePrice = property.base_price || 0;
    const pricePerNight = property.price_per_night || 0;
    const nightsTotal = pricePerNight * numberOfNights;
    const grandTotal = basePrice + nightsTotal;

    const images: GalleryItem[] = property.images ? property.images.map(img => ({
        original: img.url,
        thumbnail: img.url
    })) : [];
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
            {isOwner && <Button onClick={() => {
                navigate(`/property/${property.id}/edit`);
            }}>
                <SquarePen />
                Modifier le logement</Button>}

            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-2 space-y-8">
                    {images.length > 0 ? <div className="w-full overflow-hidden rounded-2xl shadow-md bg-gray-50">
                        <ImageGallery
                            ref={galleryRef}
                            items={images}
                            autoPlay
                            slideInterval={2000}
                            onSlide={(index) => console.log("Slid to", index)}
                        />
                    </div> : <p>Aucune image</p>}
                    <div className="border-b pb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">À propos de ce logement</h2>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    {property.user && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-4 text-lg font-semibold text-gray-800">
                                    <div aria-hidden="true" className="rounded-full size-8 mx-auto" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${property.id}")` }}></div>
                                    Logement proposé par {property.user.name}
                                </h3>
                                <Link to={`/user/${property.user.id}`} viewTransition>
                                    <Button variant="outline" size="sm">
                                        Voir le profil
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    )}

                    <div>
                        <h2 className="flex gap-2 items-center text-2xl font-semibold mb-4 text-gray-800">
                            <Map />
                            Où se situe le logement
                        </h2>
                        <p>La localisation précise sera donnée une fois la réservation terminé.</p>
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <PropertyLocation longitude={parseFloat(property.longitude)} latitude={parseFloat(property.latitude)} />
                        </div>
                    </div>

                    <Card>
                        <h2 className='text-title-medium'>Avis ({property.ratings.length})</h2>
                        <h3 className='text-title-large flex gap-1 items-center'><Star fill="currentColor" size={40} /> {property.ratings_avg}</h3>
                        <ul className='grid grid-cols-2 gap-4'>
                            {property.ratings.map((rating) => (<li className='max-w-xs'>
                                <Card>
                                    <div className="flex items-center gap-2 justify-center">
                                        <div aria-hidden="true" className="rounded-full size-6 mx-auto" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${rating?.author.id}")` }}></div>
                                        <span className='font-semibold'>{rating.author.name}</span>
                                        <span className='flex'><Star fill="currentColor" /> {rating.stars}/5</span>
                                    </div>
                                    <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga aut cupiditate voluptatem incidunt illo dolore, id minima dolor ab sunt.</p>
                                    <span className='text-base-content/60'>Avis laissé en {formatDate(rating.created_at, "MMMM yyyy", { locale: frCA })}</span>
                                </Card>
                            </li>))}
                        </ul>
                        <Link to={`/property/${property.id}/rate`}>
                            <Button>Donner son avis</Button>
                        </Link>
                    </Card>
                </div>

                {!isOwner && <div className="flex-1">
                    <Card className="sticky top-8 p-6 space-y-6">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <span className="text-2xl font-bold">{property.price_per_night}€</span>
                                <span className="text-gray-500"> / nuit</span>
                            </div>
                        </div>
                        <Card className='bg-base-300'>
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
                        </Card>

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
                            viewTransition
                        >
                            <Button className='text-xl py-3 w-full font-semibold' disabled={true}>
                                {numberOfNights > 0 ? 'Réserver maintenant' : 'Sélectionnez vos dates'}
                            </Button>
                        </Link>

                        <p className="text-center text-xs text-gray-400">Aucun montant ne vous sera débité pour le moment</p>
                    </Card>
                </div>}
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
            <CircleMarker
                center={[latitude, longitude]}
                radius={25}
                pathOptions={{
                    color: '#4f46e5',
                    fillColor: '#818cf8',
                    fillOpacity: 0.25,
                    weight: 2,
                }}
            />
        </MapContainer>
    </div>
}