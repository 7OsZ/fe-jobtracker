import type { ErrorBody } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_URL

export const TOKEN_KEY = 'lamar.token'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message)
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

// Set from main.ts so the client does not import the auth store and router.
let onUnauthorized: () => void = () => {}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  // 204 from logout and delete has no body to parse.
  if (response.status === 204) return undefined as T

  if (response.status === 401 && token) onUnauthorized()

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = data as ErrorBody | null
    throw new ApiError(response.status, error?.message ?? response.statusText, error?.errors)
  }
  return data as T
}
