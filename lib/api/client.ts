import axios from "axios";
import { useAuthStore } from "../store/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach access token
client.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        // Ensure token exists, is a string, and isn't the literal string 'null' or 'undefined'
        if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
            if (config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Token Refresh
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = useAuthStore.getState().refreshToken;
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await axios.post(`${API_URL}/auth/refresh`, {
                    token: refreshToken,
                });

                useAuthStore.getState().updateAccessToken(data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                return client(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
