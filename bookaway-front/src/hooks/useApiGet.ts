import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

export interface UseApiGetResult<T> {
    data: T | null;
    isLoading: boolean;
    error: any;
    refetch: () => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useApiGet<T>(url: string | null, config?: any): UseApiGetResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!!url);
    const [error, setError] = useState<any>(null);

    // Keep dynamic config references stable using a ref to prevent unnecessary refetches
    const configRef = useRef(config);
    useEffect(() => {
        configRef.current = config;
    }, [config]);

    const fetchData = useCallback(async () => {
        if (!url) return;
        try {
            setIsLoading(true);
            const res = await api.get<T>(url, configRef.current);
            setData(res.data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (url) {
            fetchData();
        } else {
            setData(null);
            setIsLoading(false);
            setError(null);
        }
    }, [url, fetchData]);

    return { data, isLoading, error, refetch: fetchData, setData };
}
