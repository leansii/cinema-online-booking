import type { AxiosError } from 'axios'
import type { ApiError } from './types'

export function normalizeApiError(error: unknown): ApiError {
  if ((error as AxiosError)?.isAxiosError) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>
    const normalized: ApiError = new Error(axiosError.message)

    normalized.status = axiosError.response?.status

    const payload = axiosError.response?.data ?? {}
    normalized.payload = {
      message: payload.message ?? axiosError.message ?? 'Неизвестная ошибка',
      error: payload.error,
    }

    return normalized
  }

  if (error instanceof Error) {
    return error as ApiError
  }

  const fallback: ApiError = new Error('Unexpected error')
  fallback.status = 0
  return fallback
}
