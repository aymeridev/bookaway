import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../hooks/useApiGet";
import type { LaravelPaginator, Property } from "../types";
import type { PropertiesSearchValues } from "../schemas/properties";
import { objectToSearchParams } from "../api/utils";

export interface PropertiesCountResponse {
    properties: number;
}

export async function fetchPropertiesCount() {
    return (await apiGet<PropertiesCountResponse>('/properties/count')).data
}

export function usePropertiesCount() {
    return useQuery({
        queryKey: ['properties-count'],
        queryFn: fetchPropertiesCount
    })
}


async function fetchSearchProperties(params: PropertiesSearchValues) {
    const queryString = objectToSearchParams(params).toString();
    return (await apiGet<LaravelPaginator<Property>>(`/properties?${queryString}`)).data;
}

export function useSearchProperties(params: PropertiesSearchValues) {
    return useQuery({
        queryKey: ['search-properties', params],
        queryFn: () => fetchSearchProperties(params)
    })
}


function fetchPropertyDetails(propertyId: number | string) {
    return apiGet<Property>(`/properties/${propertyId.toString()}`);
}

export function usePropertyDetails(propertyId: number | string) {
    return useQuery({
        queryKey: ['property-details', propertyId],
        queryFn: () => fetchPropertyDetails(propertyId)
    })
}
