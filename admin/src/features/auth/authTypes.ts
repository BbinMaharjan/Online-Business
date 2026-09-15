export interface AdminCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "STAFF";
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: AdminUser;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  permissions: string[];
  setAuth: (auth: AdminUser, permissions: string[]) => void;
  clearAuth: () => void;
}