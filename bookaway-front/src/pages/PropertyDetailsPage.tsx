import { useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { Link, useParams, useSearchParams, useNavigate } from "react-router";
import { differenceInDays, parseISO, eachDayOfInterval, formatDate, format } from "date-fns";
import { fr, enUS as dpEnUS } from 'react-day-picker/locale';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import { Card } from '../components/Card';
import useAuthStore from '../context/AuthStore';
import { fr as dfFr, enUS as dfEnUS } from 'date-fns/locale';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, CheckCircleIcon, InfoIcon, MapTrifoldIcon, PenIcon, SpinnerIcon, StarIcon, UserCircleIcon } from '@phosphor-icons/react';
import { usePropertyDetails } from '../services/properties';

export function PropertyDetailsPage() {
    const { t, i18n } = useTranslation();
    const isFrench = i18n.language.startsWith("fr");
    const dpLocale = isFrench ? fr : dpEnUS;
    const dfLocale = isFrench ? dfFr : dfEnUS;

    const { id } = useParams<{ id: string }>();
    const { data, isPending, refetch } = usePropertyDetails(id!);
    const property = data?.data;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const [ratingStars, setRatingStars] = useState<number>(5);
    const [ratingComment, setRatingComment] = useState<string>('');
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

    if (!property || isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <SpinnerIcon className="w-12 h-12 animate-spin text-blue-600" />
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
            <button
                className='btn'
                onClick={() => navigate(-1)}
            >
                <ArrowLeftIcon />
                {t("property-details.back-results")}
            </button>
            {isOwner && <button onClick={() => {
                navigate(`/property/${property.id}/edit`);
            }}>
                <PenIcon />
                {t("property-details.edit-property")}</button>}

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
                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="text-title-small flex items-center gap-2">
                                <InfoIcon />
                                {t("property-details.about-title")}
                            </h2>
                            <p className="text-lg leading-relaxed">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {property.user && (
                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-4 text-lg font-semibold text-gray-800">
                                        <div aria-hidden="true" className="rounded-full size-8 mx-auto" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${property.id}")` }}></div>
                                        {t("property-details.hosted-by", { name: property.user.name })}
                                    </h3>
                                    <Link to={`/user/${property.user.id}`} viewTransition>
                                        <button className='btn btn-soft btn-primary'>
                                            <UserCircleIcon />
                                            {t("property-details.view-profile")}
                                        </button>
                                    </Link>
                                </div>
                                <div className="flex gap-2">
                                    <span className='badge badge-primary badge-soft'>Membre depuis {format(property.user.created_at, "MMMM yyyy", { locale: dfLocale })}</span>
                                    <span className='badge badge-neutral badge-soft'>Compte validé</span>

                                </div>
                            </div>
                        </div>
                    )}

                    <div className='card bg-base-200 shadow-md'>
                        <div className="card-body">
                            <h2 className="text-title-small">
                                <MapTrifoldIcon />
                                {t("property-details.where-title")}
                            </h2>
                            <p>{t("property-details.where-info")}</p>
                            <div className="rounded-2xl overflow-hidden">
                                <PropertyLocation longitude={parseFloat(property.longitude)} latitude={parseFloat(property.latitude)} />
                            </div>
                        </div>
                    </div>

                    <div className='card bg-base-200'>
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className='text-title-medium'>{t("property-details.reviews")} ({property.ratings.length})</h2>
                                    <h3 className='text-title-small flex items-center gap-2'><StarIcon weight='fill' className='size-6' /> {property.ratings_avg}</h3>
                                </div>
                                {!isOwner && (
                                    (() => {
                                        const hasAlreadyReviewed = user && property.ratings.some((r: any) => r.author?.id === user.id || r.user_id === user.id);
                                        return hasAlreadyReviewed ? (
                                            <span className="text-sm text-gray-500 italic">{t("property-details.already-reviewed")}</span>
                                        ) : (
                                            <button onClick={handleOpenModal}>{t("property-details.give-review")}</button>
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
                                                    <span className='flex items-center gap-1 text-yellow-500 font-semibold'><StarIcon weight="fill" className="size-4" /> {rating.stars}/5</span>
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
                        </div>
                    </div>

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
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRatingStars(star)}
                                                className='btn btn-soft'
                                            >
                                                <StarIcon
                                                    weight={star <= ratingStars ? 'fill' : 'regular'}
                                                    className={`size-8 ${star <= ratingStars ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            </button>
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
                                    <button
                                        type="button"
                                        onClick={() => dialogRef.current?.close()}
                                    >
                                        {t("property-details.modal-cancel")}
                                    </button>
                                    <button
                                        type="submit"
                                    >
                                        {t("property-details.modal-submit")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>

                {!isOwner && <div className="flex-1">
                    <div className="card shadow-md bg-base-200 sticky top-8">
                        <div className="card-body">
                            <div className="flex justify-between items-baseline">
                                <div>
                                    <span className="text-2xl font-bold">{property.price_per_night}€</span>
                                    <span className="text-gray-500"> {t("property-details.per-night")}</span>
                                </div>
                            </div>
                            <DayPicker
                                mode="range"
                                selected={range}
                                onSelect={handleSelectRange}
                                disabled={disabledDays}
                                month={month}
                                locale={dpLocale}
                                onMonthChange={setMonth}
                                className="react-day-picker"
                            />

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-base-content/80">
                                    <span className="underline">
                                        {t("property-details.price-nights", { price: property.price_per_night, count: numberOfNights })}
                                    </span>
                                    <span className='font-medium'>{nightsTotal}€</span>
                                </div>
                                <div className="flex justify-between text-base-content/80">
                                    <span className="underline">{t("property-details.service-fees")}</span>
                                    <span className='font-medium'>{basePrice}€</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>{t("property-details.total")}</span>
                                    <span>{grandTotal}€</span>
                                </div>
                            </div>

                            {!user ? (
                                <>
                                    <button className='btn btn-primary btn-xl py-3 w-full font-semibold' disabled>
                                        {t("property-details.book-now")}
                                    </button>
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
                                        className={`btn btn-xl btn-primary w-full ${numberOfNights === 0 && "btn-disabled"}`}
                                    >
                                        <CheckCircleIcon />
                                        {numberOfNights > 0 ? t("property-details.book-now") : t("property-details.select-dates")}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
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
            <Marker
                position={[latitude, longitude]}
                interactive={false}
            />
        </MapContainer>
    </div>
}