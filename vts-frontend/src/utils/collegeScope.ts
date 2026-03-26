import { useAuthStore } from '@store/authStore'
import { useCollegeFilterStore } from '@store/collegeFilterStore'

export function getActiveCollegeFilterId(): string | null {
  const role = useAuthStore.getState().role

  if (role !== 'SUPER_ADMIN') {
    return null
  }

  return useCollegeFilterStore.getState().selectedCollegeId
}

export function filterByActiveCollege<T>(items: T[]): T[] {
  const selectedCollegeId = getActiveCollegeFilterId()

  if (!selectedCollegeId) {
    return items
  }

  return items.filter((item) => {
    if (!item || typeof item !== 'object' || !('collegeId' in item)) {
      return true
    }

    return item.collegeId === selectedCollegeId
  })
}
