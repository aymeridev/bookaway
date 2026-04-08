
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type User = {
    id: string;
    email: string;
    name: string;
    owner: boolean;
    email_verified_at: string;
    updated_at: string;
    created_at: string;
}

type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user: User, token: string) =>
                set({
                    user,
                    token,
                    isAuthenticated: true
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                }),

            updateUser: (partialUser: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...partialUser } : null,
                })),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;