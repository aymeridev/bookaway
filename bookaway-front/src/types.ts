export interface LaravelPaginator<T> {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    data: T[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    email_verified_at: string;
    updated_at: string;
    created_at: string;
}

export interface Property {
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
    address?: string;
    ratings_avg: number;
    ratings: {
        id: number;
        created_at: string;
        stars: number;
        comment?: string;
        user_id: number;
        author: {
            id: number;
            name: string;
        }
    }[]
}

export interface PropertyImage {
    id: number;
    path: string;
    url: string;
    sort_order: number
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    code?: string;
}

export interface Booking {
    id: number;
    start_date: string;
    end_date: string;
    total_price: number;
    travelers: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    cancellation_reason?: string | null;
    property: Property;
    user?: {
        id: number;
        name: string;
    };
}

export interface ChatMessage {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    created_at: string;
}

export interface Conversation {
    id: number;
    user_id: number;
    owner_id: number;
    property_id: number;
    updated_at: string;
    user: { id: number; name: string };
    owner: { id: number; name: string };
    property: { id: number; title: string; images: { url: string }[] };
    messages: ChatMessage[];
    unread_count: number;
    booking?: Booking | null;
}