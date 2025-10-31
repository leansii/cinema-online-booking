import { httpClient } from '@/shared/api'

export interface AuthResponse {
  token: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  passwordConfirmation: string
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/register', payload)
  return data
}
