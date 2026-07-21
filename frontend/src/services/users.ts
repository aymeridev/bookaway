import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../api/axios"
import { type User } from "../types"


async function fetchCurrentUser() {
    return (await api.get<User>('users/me')).data
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['users', 'me'],
        queryFn: fetchCurrentUser
    })
}


function fetchAddFunds(amount: number) {
    return api.post('/users/add-funds', {
        amount
    })
}

export function useAddFunds() {
    return useMutation({
        mutationFn: (amount: number) => fetchAddFunds(amount),
        meta: {
            successMessage: "super",
            errorMessage: "erreur!",
        }
    })
}
