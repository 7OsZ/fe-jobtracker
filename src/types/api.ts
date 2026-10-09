import type { Status } from '@/constants/status'

export interface User {
  id: number
  name: string
  email: string
}

export interface Application {
  id: number
  company: string
  position: string
  url: string | null
  location: string | null
  status: Status
  applied_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ApplicationInput = Pick<Application, 'company' | 'position' | 'status'> &
  Partial<Pick<Application, 'url' | 'location' | 'applied_at' | 'notes'>>

export interface Resource<T> {
  data: T
}

export interface AuthResponse extends Resource<User> {
  token: string
}

export interface ErrorBody {
  message: string
  errors?: Record<string, string[]>
}
