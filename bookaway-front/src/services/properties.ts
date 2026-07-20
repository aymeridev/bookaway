import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../hooks/useApiGet";
import type { LaravelPaginator, Property } from "../types";
import type { PropertiesSearchValues } from "../schemas/properties";
import { objectToSearchParams } from "../api/utils";

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


export async function fetchSearchProperties(params: PropertiesSearchValues): Promise<LaravelPaginator<Property>> {
    const queryString = objectToSearchParams(params).toString();
    return (await apiGet<LaravelPaginator<Property>>(`/properties?${queryString}`)).data;
}

export function useSearchProperties(params: PropertiesSearchValues) {
    console.log(params);
    return useQuery({
        queryKey: ['search-properties', params],
        queryFn: () => fetchSearchProperties(params)
    })
}