export interface LaravelPaginator<T> {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    data: T[];
}

export interface Entity {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface User extends Entity {
    email: string;
    name: string;
    email_verified_at: string;
}

export interface Property extends Entity {
    title: string;
    type: "camping" | "hotel" | "other";
    description: string;
    amenities: string[];
    images: PropertyImage[];
    latitude: string;
    longitude: string;
    distance?: number;
    bookings?: any[];
    user_id?: number;
    user?: User;
    address?: string;
    ratings_avg: number;
    units: Unit[];
    ratings: Rating[]
}

export interface Rating extends Entity {
    stars: number;
    comment?: string;
    user_id: number;
    author: Pick<User, 'id' | 'name'>
}

export interface Unit extends Entity {
    title: string;
    type: string;
    capacity: number;
    description: string;
    amenities: string[];
    base_fee: number;
    price_per_night: number;
}

export interface PropertyImage extends Entity {
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

export interface Booking extends Entity {
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

export interface ChatMessage extends Entity {
    conversation_id: number;
    sender_id: number;
    content: string;
}

export interface Conversation extends Entity {
    user_id: number;
    owner_id: number;
    property_id: number;
    user: { id: number; name: string };
    owner: { id: number; name: string };
    property: { id: number; title: string; images: { url: string }[] };
    messages: ChatMessage[];
    unread_count: number;
    booking?: Booking | null;
}