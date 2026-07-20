import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../hooks/useApiGet";
import type { LaravelPaginator, Property } from "../types";

export interface PropertiesCountResponse {
    properties: number;
}

export async function fetchPropertiesCount(): Promise<PropertiesCountResponse> {
    return (await apiGet<PropertiesCountResponse>('/properties/count')).data
}

export function usePropertiesCount() {
    return useQuery({
        queryKey: ['properties-count'],
        queryFn: fetchPropertiesCount
    })
}


export async function fetchSearchProperties(params: URLSearchParams): Promise<LaravelPaginator<Property>> {
    const queryString = params.toString();
    return (await apiGet<LaravelPaginator<Property>>(`/properties?${queryString}`)).data;
}

export function useSearchProperties(params: URLSearchParams) {
    console.log(params);
    return useQuery({
        queryKey: ['search-properties', params],
        queryFn: () => fetchSearchProperties(params)
    })
}