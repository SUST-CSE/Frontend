import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            loading: true,

            login: (userData, token) => {
                set({ user: userData, isAuthenticated: true });
                Cookies.set('token', token, { expires: 7 });
                Cookies.set('user', JSON.stringify(userData), { expires: 7 });
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
                Cookies.remove('token');
                Cookies.remove('user');
            },

            updateUser: (userData) => {
                set({ user: userData });
                Cookies.set('user', JSON.stringify(userData), { expires: 7 });
            },

            checkAuth: () => {
                const token = Cookies.get('token');
                const userCookie = Cookies.get('user');
                if (token && userCookie) {
                    set({ isAuthenticated: true, user: JSON.parse(userCookie) });
                } else {
                    set({ isAuthenticated: false, user: null });
                }
                set({ loading: false });
            }
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useStore;