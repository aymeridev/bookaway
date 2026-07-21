import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";

function fetchAuthLogin(data: { email: string, password: string }) {
    return api.post('/login', data)
}

export function useAuthLogin() {
    return useMutation({
        mutationFn: (data: any) => fetchAuthLogin(data),
        meta: {
            successMessage: "Bienvenue!",
            errorMessage: "Une erreur est survenue",
        }
    })
}