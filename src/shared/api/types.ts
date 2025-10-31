export interface ApiErrorPayload {
  message: string
  error?: string
}

export interface ApiError extends Error {
  status?: number
  payload?: ApiErrorPayload
}
