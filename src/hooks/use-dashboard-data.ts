import useSWR from 'swr';
import { CloudLog } from '@/lib/cloud-service';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLogs(provider: string, page: number = 1, limit: number = 50, from?: string, to?: string) {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (from) queryParams.append('from', from);
    if (to) queryParams.append('to', to);

    const { data, error, isLoading, mutate } = useSWR(
        `/api/logs/${provider}?${queryParams.toString()}`,
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: false
        }
    );

    return {
        logs: data?.data as CloudLog[],
        isLoading,
        isError: error,
        mutate,
    };
}

export function useAnomalies() {
    const { data, error, isLoading } = useSWR('/api/anomalies', fetcher, {
        refreshInterval: 30000,
    });

    return {
        anomalies: data?.data,
        isLoading,
        isError: error,
    };
}
