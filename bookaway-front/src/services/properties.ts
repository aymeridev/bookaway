import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../hooks/useApiGet";

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