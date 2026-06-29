export type User = {
    id: string;
    email: string;
    name: string;
    owner: boolean;
    email_verified_at: string;
    updated_at: string;
    created_at: string;
}

export type Property = {
    id: number;
    title: string;
    type: string;
    capacity: number;
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
    bookings?: any[];
    user_id?: number;
    user?: User;
    ratings_avg: number;
    ratings: {
        id: number;
        created_at: string;
        stars: number;
        user_id: number;
        author: {
            id: number;
            name: string;
        }
    }[]
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