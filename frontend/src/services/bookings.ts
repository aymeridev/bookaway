import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../hooks/useApiGet";
import type { Booking } from "../types";

async function fetchMyBookings() {
    return (await apiGet<Booking[]>('/my-bookings')).data;
}

export function useMyBookings() {
    return useQuery({
        queryKey: ['my-bookings'],
        queryFn: fetchMyBookings
    })
}