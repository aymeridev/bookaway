export type Property = {
    id: number;
    title: string;
    type: string;
    description: string;
    amenities: string[];
    base_price: number;
    images: PropertyImage[];
    latitude: string;
    longitude: string;
    price_per_night: number;
    created_at: string;
    updated_at: string;
    distance?: number;
}

export type PropertyImage = {
    id: number;
    path: string;
    url: string;
    sort_order: number
}

export type ApiResponse<T> = {
    data: T;
    message: string;
    code?: string;

}