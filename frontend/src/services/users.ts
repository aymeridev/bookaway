import { useMutation } from "@tanstack/react-query"
import api from "../api/axios"

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
