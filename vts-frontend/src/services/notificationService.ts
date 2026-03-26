import type { Notification } from '../types/notification'
import { apiClient } from '../api/apiClient'
import { filterByActiveCollege } from '@utils/collegeScope'

type CreateNotificationInput = {
  type: Notification['type']
  vehicleId: string
  vehicleName: string
  message: string
  location: string
  geofenceId?: string
  routeName?: string
  timestamp?: string
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const notifications = await apiClient.get<Notification[]>('/notifications')
    return filterByActiveCollege(notifications)
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    await apiClient.patch(`/notifications/${notificationId}/read`)
    const notifications = await this.getNotifications()
    return notifications.find((notification) => notification.id === notificationId) ?? null
  }

  async markAllAsRead(): Promise<Notification[]> {
    await apiClient.patch('/notifications/read-all')
    return this.getNotifications()
  }

  async createNotification(payload: CreateNotificationInput): Promise<Notification> {
    return apiClient.post<Notification>('/notifications', payload)
  }
}

export const notificationService = new NotificationService()
