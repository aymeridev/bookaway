import { apiGet, useApiGet } from './useApiGet';
import type { Property, User, Booking, LaravelPaginator } from '../types';

// Fetch details of a user profile (which includes bookings)
export function useUserProfile(userId: string | number | undefined) {
    return useApiGet<User & { bookings?: any[] }>(userId ? `/users/${userId}` : null);
}

// Fetch properties owned by a user
export function useUserProperties(userId: string | number | undefined) {
    return useApiGet<Property[]>(userId ? `/users/${userId}/properties` : null);
}

// Fetch booking details
export function useBookingDetails(bookingId: string | number | undefined) {
    return useApiGet<Booking>(bookingId ? `/bookings/${bookingId}` : null);
}


// Search for properties based on search params
export function useSearchProperties(params: URLSearchParams) {
    const queryString = params.toString();
    return useApiGet<LaravelPaginator<Property>>(`/properties?${queryString}`);
}

// Fetch user's reservations
export function useMyReservations() {
    return useApiGet<Booking[]>('/my-reservations');
}

// Fetch user's properties
export function useMyProperties() {
    return useApiGet<Property[]>('/my-properties');
}


// Return all properties in API
export function usePropertiesCount() {
    return apiGet("/properties/count")
}


// Fetch property details
export function usePropertyDetails(propertyId: string | number | undefined) {
    return useApiGet<Property>(propertyId ? `/properties/${propertyId}` : null);
}
