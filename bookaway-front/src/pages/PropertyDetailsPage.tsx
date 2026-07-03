import { useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { Link, useParams, useSearchParams, useNavigate } from "react-router";
import { differenceInDays, parseISO, eachDayOfInterval, formatDate } from "date-fns";
import Button from '../components/ui/Button';
import { ArrowLeft, Map, SquarePen, Star, Loader2 } from 'lucide-react';
import { fr, enUS as dpEnUS } from 'react-day-picker/locale';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import { Card } from '../components/Card';
import useAuthStore from '../context/AuthStore';
import { fr as dfFr, enUS as dfEnUS } from 'date-fns/locale';
import { usePropertyDetails } from '../hooks/apiHooks';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

export function PropertyDetailsPage() {
    const { t, i18n } = useTranslation();
    const isFrench = i18n.language.startsWith("fr");
    const dpLocale = isFrench ? fr : dpEnUS;
    const dfLocale = isFrench ? dfFr : dfEnUS;

    const { id } = useParams<{ id: string }>();
    const { data: property, isLoading, refetch } = usePropertyDetails(id);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const [ratingStars, setRatingStars] = useState<number>(5);
    const [ratingComment, setRatingComment] = useState<string>('');
    const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleOpenModal = () => {
        if (!user) {
            toast.error(t("property-details.auth-error-rating"));
            navigate('/login');
            return;
        }
        dialogRef.current?.showModal();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
            dialogRef.current?.close();
        }
    };

    const handleRatingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!property) return;
        setIsSubmittingRating(true);
        setSubmitError(null);

        try {
            await api.post('/ratings', {
                ratable_type: 'property',
                ratable_id: property.id,
                stars: ratingStars,
                comment: ratingComment
            });
            
            toast.success(t("property-details.rating-success"));
            setRatingComment('');
            setRatingStars(5);
            dialogRef.current?.close();
            refetch();
        } catch (err: any) {
            console.error(err);
            const errMsg = err.response?.data?.message || t("property-details.rating-error");
            setSubmitError(errMsg);
            toast.error(errMsg);
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");

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
    const galleryRef = useRef<ImageGalleryRef>(null);

    if (isLoading || !property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">{t("property-details.loading")}</p>
            </div>
        );
    }

    const isOwner = user?.id === property.user_id;

    const disabledDays = [
        { before: new Date() },
        ...(property.bookings || []).map((booking: any) => ({
            from: parseISO(booking.start_date),
            to: parseISO(booking.end_date)
        }))
    ];

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
            alert(t("property-details.dates-blocked"));
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

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <Button
                variant="flat"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft />
                {t("property-details.back-results")}
            </Button>
            {isOwner && <Button onClick={() => {
                navigate(`/property/${property.id}/edit`);
            }}>
                <SquarePen />
                {t("property-details.edit-property")}</Button>}

            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-2 space-y-8">
                    {images.length > 0 ? <div className="w-full overflow-hidden rounded-2xl shadow-md bg-gray-50 property-details-gallery">
                        <ImageGallery
                            ref={galleryRef}
                            items={images}
                            autoPlay
                            slideInterval={2000}
                        />
                    </div> : <p>{t("property-details.no-image")}</p>}
                    <div className="border-b pb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t("property-details.about-title")}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    {property.user && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-4 text-lg font-semibold text-gray-800">
                                    <div aria-hidden="true" className="rounded-full size-8 mx-auto" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${property.id}")` }}></div>
                                    {t("property-details.hosted-by", { name: property.user.name })}
                                </h3>
                                <Link to={`/user/${property.user.id}`} viewTransition>
                                    <Button variant="outline" size="sm">
                                        {t("property-details.view-profile")}
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    )}

                    <div>
                        <h2 className="flex gap-2 items-center text-2xl font-semibold mb-4 text-gray-800">
                            <Map />
                            {t("property-details.where-title")}
                        </h2>
                        <p>{t("property-details.where-info")}</p>
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <PropertyLocation longitude={parseFloat(property.longitude)} latitude={parseFloat(property.latitude)} />
                        </div>
                    </div>

                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className='text-title-medium'>{t("property-details.reviews")} ({property.ratings.length})</h2>
                                <h3 className='text-title-large flex gap-1 items-center'><Star fill="currentColor" size={40} /> {property.ratings_avg}</h3>
                            </div>
                            {!isOwner && (
                                (() => {
                                    const hasAlreadyReviewed = user && property.ratings.some((r: any) => r.author?.id === user.id || r.user_id === user.id);
                                    return hasAlreadyReviewed ? (
                                        <span className="text-sm text-gray-500 italic">{t("property-details.already-reviewed")}</span>
                                    ) : (
                                        <Button onClick={handleOpenModal}>{t("property-details.give-review")}</Button>
                                    );
                                })()
                            )}
                        </div>
                        {property.ratings.length > 0 ? (
                            <ul className='grid grid-cols-2 gap-4'>
                                {property.ratings.map((rating) => (
                                    <li key={rating.id} className='max-w-xs'>
                                        <Card>
                                            <div className="flex items-center gap-2 justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div aria-hidden="true" className="rounded-full size-6" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${rating?.author.id}")` }}></div>
                                                    <span className='font-semibold'>{rating.author.name}</span>
                                                </div>
                                                <span className='flex items-center gap-1 text-yellow-500 font-semibold'><Star className="size-4" fill="currentColor" /> {rating.stars}/5</span>
                                            </div>
                                            {rating.comment ? (
                                                <p className='text-base text-gray-600 mb-2 whitespace-pre-line'>{rating.comment}</p>
                                            ) : (
                                                <p className='text-base text-gray-400 italic mb-2'>{t("property-details.no-comment")}</p>
                                            )}
                                            <span className='text-xs text-gray-500 block'>
                                                {t("property-details.review-date", {
                                                    date: formatDate(new Date(rating.created_at), "MMMM yyyy", { locale: dfLocale })
                                                })}
                                            </span>
                                        </Card>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">{t("property-details.no-reviews")}</p>
                        )}
                    </Card>

                    <dialog
                        ref={dialogRef}
                        onClick={handleBackdropClick}
                        className="rounded-2xl p-6 shadow-2xl border border-gray-100 max-w-md w-full backdrop:bg-black/50 backdrop:backdrop-blur-sm m-auto"
                    >
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">{t("property-details.modal-title")}</h3>
                            <form onSubmit={handleRatingSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("property-details.modal-rating-label")}</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Button
                                                key={star}
                                                type="button"
                                                variant="flat"
                                                size="sm"
                                                onClick={() => setRatingStars(star)}
                                                className="p-0 border-0 bg-transparent hover:bg-transparent shadow-none hover:scale-100 active:scale-100 min-h-0 min-w-0 flex items-center justify-center focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
                                            >
                                                <Star
                                                    className={`size-8 ${star <= ratingStars ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill={star <= ratingStars ? 'currentColor' : 'none'}
                                                />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="modal-comment" className="block text-sm font-medium text-gray-700 mb-1">{t("property-details.modal-comment-label")}</label>
                                    <textarea
                                        id="modal-comment"
                                        value={ratingComment}
                                        onChange={(e) => setRatingComment(e.target.value)}
                                        placeholder={t("property-details.modal-placeholder")}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                                    />
                                </div>
                                {submitError && (
                                    <p className="text-sm text-red-600 font-medium">{submitError}</p>
                                )}
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => dialogRef.current?.close()}
                                    >
                                        {t("property-details.modal-cancel")}
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={isSubmittingRating}
                                    >
                                        {t("property-details.modal-submit")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>

                {!isOwner && <div className="flex-1">
                    <Card className="sticky top-8 p-6 space-y-6">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <span className="text-2xl font-bold">{property.price_per_night}€</span>
                                <span className="text-gray-500"> {t("property-details.per-night")}</span>
                            </div>
                        </div>
                        <Card className='bg-base-300'>
                            <DayPicker
                                mode="range"
                                selected={range}
                                onSelect={handleSelectRange}
                                disabled={disabledDays}
                                month={month}
                                locale={dpLocale}
                                onMonthChange={setMonth}
                                className="m-0"
                            />
                        </Card>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-gray-600">
                                <span className="underline">
                                    {t("property-details.price-nights", { price: property.price_per_night, count: numberOfNights })}
                                </span>
                                <span>{nightsTotal}€</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="underline">{t("property-details.service-fees")}</span>
                                <span>{basePrice}€</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>{t("property-details.total")}</span>
                                <span>{grandTotal}€</span>
                            </div>
                        </div>

                        {!user ? (
                            <>
                                <Button className='text-xl py-3 w-full font-semibold' disabled>
                                    {t("property-details.book-now")}
                                </Button>
                                <p className="text-center text-sm text-amber-600 font-medium">{t("property-details.login-required")}</p>
                            </>
                        ) : (
                            <>
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
                                    onClick={(e) => {
                                        if (numberOfNights === 0) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <Button className='text-xl py-3 w-full font-semibold' disabled={numberOfNights === 0}>
                                        {numberOfNights > 0 ? t("property-details.book-now") : t("property-details.select-dates")}
                                    </Button>
                                </Link>
                                <p className="text-center text-xs text-gray-400">{t("property-details.no-charge-yet")}</p>
                            </>
                        )}
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