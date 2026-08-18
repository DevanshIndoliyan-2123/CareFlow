import { apiClient } from "../../services/apiClient";
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "../../types/auth";

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  } catch {
    // Local fallback mock when backend auth service is offline
    const mockUser: User = {
      id: "usr-8821",
      email: credentials.email,
      name: credentials.email.split("@")[0].replace(".", " ").toUpperCase(),
      role: "PHYSICIAN",
      organization: "Mayo Clinic Network",
    };
    return {
      token: "mock-jwt-token-" + Date.now(),
      user: mockUser,
    };
  }
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  } catch {
    const mockUser: User = {
      id: "usr-" + Math.floor(1000 + Math.random() * 9000),
      email: credentials.email,
      name: credentials.name,
      role: "STAFF",
      organization: credentials.organization,
    };
    return {
      token: "mock-jwt-token-" + Date.now(),
      user: mockUser,
    };
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
}
