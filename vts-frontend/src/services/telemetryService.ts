import type { TelemetryFilter, TelemetryRecord } from '../types/telemetry'
import { apiClient } from '../api/apiClient'
import { filterByActiveCollege } from '@utils/collegeScope'

class TelemetryService {
  async getTelemetry(filters?: TelemetryFilter): Promise<TelemetryRecord[]> {
    const query = new URLSearchParams()
    if (filters?.vehicleId) query.set('vehicleId', filters.vehicleId)
    if (typeof filters?.ignition === 'boolean') query.set('ignition', String(filters.ignition))
    if (filters?.startDate) query.set('startDate', filters.startDate)
    if (filters?.endDate) query.set('endDate', filters.endDate)

    const suffix = query.toString() ? `?${query.toString()}` : ''
    const rows = await apiClient.get<TelemetryRecord[]>(`/telemetry${suffix}`)
    return filterByActiveCollege(rows)
  }

  async getTelemetryByVehicle(vehicleId: string): Promise<TelemetryRecord[]> {
    return this.getTelemetry({ vehicleId })
  }
}

export const telemetryService = new TelemetryService()
