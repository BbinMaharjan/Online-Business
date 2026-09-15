import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "@/store";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.auth?.accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Don't auto-refresh for the initial /auth/me call - let the auth state handle it
        const isAuthMeCall = originalRequest.url === "/auth/me";

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthMeCall) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const state = store.getState();
            const refreshToken = state.auth?.refreshToken;
            
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken },
              { withCredentials: true },
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            store.dispatch({
              type: "auth/setAccessToken",
              payload: accessToken,
            });
            
            // Update refresh token in store if rotated
            if (newRefreshToken) {
              store.dispatch({
                type: "auth/setRefreshToken",
                payload: newRefreshToken,
              });
            }

            this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
            this.failedQueue = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            store.dispatch({ type: "auth/clearAuth" });
            // Only redirect if not already on login page
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  get<T>(url: string, params?: object) {
    return this.client.get<T>(url, { params });
  }

  post<T>(url: string, data?: object) {
    return this.client.post<T>(url, data);
  }

  patch<T>(url: string, data?: object) {
    return this.client.patch<T>(url, data);
  }

  put<T>(url: string, data?: object) {
    return this.client.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }

  upload<T>(url: string, formData: FormData) {
    return this.client.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
