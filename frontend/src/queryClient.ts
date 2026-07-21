import { MutationCache, QueryClient, type QueryKey } from "@tanstack/react-query";
import toast from "react-hot-toast";

declare module "@tanstack/react-query" {
    interface Register {
        mutationMeta: {
            invalidesQuery?: QueryKey;
            successMessage?: string;
            errorMessage?: string;
        }
    }
}

export const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onSuccess: (_data, _variables, _context, mutation) => {
            if (mutation.meta?.successMessage) {
                toast.success(mutation.meta.successMessage);
            }
        },
        onError: (_data, _variables, _context, mutation) => {
            if (mutation.meta?.errorMessage) {
                toast.error(mutation.meta.errorMessage);
            }
        },
        onSettled: (_data, _error, _variables, _context, mutation) => {
            if (mutation.meta?.invalidesQuery) {
                queryClient.invalidateQueries({
                    queryKey: mutation.meta?.invalidesQuery
                })
            }

        }
    })
});