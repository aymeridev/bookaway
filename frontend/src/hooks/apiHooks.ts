import { useApiGet } from './useApiGet';
import type { Property, Booking } from '../types';

// Fetch properties owned by a user
export function useUserProperties(userId: string | number | undefined) {
    return useApiGet<Property[]>(userId ? `/users/${userId}/properties` : null);
}

// Fetch booking details
export function useBookingDetails(bookingId: string | number | undefined) {
    return useApiGet<Booking>(bookingId ? `/bookings/${bookingId}` : null);
}