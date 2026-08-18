export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'PHYSICIAN' | 'AUDITOR' | 'STAFF';
  organization?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  organization: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
