import axios, { AxiosError, AxiosHeaders } from 'axios'
import { getApiBaseUrl } from '@/shared/config/env'

type TokenProvider = () => string | null

let tokenProvider: TokenProvider = () => null

export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider
}

export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = tokenProvider()

  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {})
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Preserve error shape but ensure consistent rejection.
    return Promise.reject(error)
  }
)
