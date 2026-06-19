import { api } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  token: string;
}

export const authApi = {
  signUp: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', data).then(res => res.data),

  signIn: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signin', data).then(res => res.data),

  logout: () => api.post('/auth/logout').then(res => res.data),
};
