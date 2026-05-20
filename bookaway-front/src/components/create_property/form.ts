export type PropertyForm = {
    title: string,
    type: string,
    capacity: string,
    images: { url: string }[],
    amenities: { value: string }[],
    description: string,
    base_price: string,
    price_per_night: string,
    latitude: string,
    longitude: string
}