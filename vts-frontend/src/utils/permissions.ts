import type { UserRole } from '@services/authService'

export type AppPage =
  | '/dashboard'
  | '/vehicles'
  | '/devices'
  | '/routes'
  | '/geofence'
  | '/trips'
  | '/live-map'
  | '/telemetry'
  | '/notifications'
  | '/overspeed'
  | '/idling'
  | '/stop'
  | '/users'

const studentHiddenPages = new Set<AppPage>(['/devices', '/telemetry', '/users'])

export function canCreate(role: UserRole | null): boolean {
  return role !== 'STUDENT' && role !== null
}

export function canEdit(role: UserRole | null): boolean {
  return role !== 'STUDENT' && role !== null
}

export function canDelete(role: UserRole | null): boolean {
  return role !== 'STUDENT' && role !== null
}

export function canAccessPage(role: UserRole | null, page: AppPage): boolean {
  if (role === 'STUDENT') {
    return !studentHiddenPages.has(page)
  }

  return true
}
