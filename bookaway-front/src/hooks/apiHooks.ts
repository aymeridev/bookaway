import { useEffect } from 'react';
import { useApiGet } from './useApiGet';
import type { Property, User, Booking, Conversation } from '../types';

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

// Fetch all conversations (with optional polling interval)
export function useConversations(intervalMs?: number) {
    const result = useApiGet<Conversation[]>('/conversations');
    const { refetch } = result;

    useEffect(() => {
        if (!intervalMs) return;
        const interval = setInterval(() => {
            refetch();
        }, intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs, refetch]);

    return result;
}

// Search for properties based on search params
export function useSearchProperties(params: URLSearchParams) {
    const queryString = params.toString();
    return useApiGet<Property[]>(`/properties?${queryString}`);
}

// Fetch user's reservations
export function useMyReservations() {
    return useApiGet<Booking[]>('/my-reservations');
}

// Fetch user's properties
export function useMyProperties() {
    return useApiGet<Property[]>('/my-properties');
}

// Fetch property details
export function usePropertyDetails(propertyId: string | number | undefined) {
    return useApiGet<Property>(propertyId ? `/properties/${propertyId}` : null);
}
