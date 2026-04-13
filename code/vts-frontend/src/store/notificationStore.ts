import { create } from 'zustand'
import { notificationService } from '@services/notificationService'
import type { Notification } from '../types/notification'

type NotificationStoreState = {
  notifications: Notification[]
  toasts: Notification[]
  unreadCount: number
  isLoaded: boolean
}

type NotificationStoreActions = {
  loadNotifications: () => Promise<void>
  refreshNotifications: (options?: { reset?: boolean }) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  dismissToast: (notificationId: string) => void
  reset: () => void
}

type NotificationStore = NotificationStoreState & NotificationStoreActions

const initialState: NotificationStoreState = {
  notifications: [],
  toasts: [],
  unreadCount: 0,
  isLoaded: false,
}

function countUnread(notifications: Notification[]): number {
  return notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0)
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  ...initialState,

  loadNotifications: async () => {
    try {
      const notifications = await notificationService.getNotifications({ page: 1, limit: 50 })
      set({
        notifications,
        unreadCount: countUnread(notifications),
        isLoaded: true,
      })
    } catch (error) {
      console.warn('Failed to load notifications', error)
      set({ notifications: [], unreadCount: 0, isLoaded: true })
    }
  },

  refreshNotifications: async (options) => {
    try {
      const notifications = await notificationService.getNotifications({ page: 1, limit: 50 })
      set((state) => {
        const previousIds = new Set(options?.reset ? [] : state.notifications.map((item) => item.id))
        const newToasts = notifications.filter((item) => !item.read && !previousIds.has(item.id))

        return {
          notifications,
          toasts: options?.reset ? [] : [...newToasts, ...state.toasts].slice(0, 5),
          unreadCount: countUnread(notifications),
          isLoaded: true,
        }
      })
    } catch (error) {
      console.warn('Failed to refresh notifications', error)
      set((state) => ({
        notifications: options?.reset ? [] : state.notifications,
        toasts: options?.reset ? [] : state.toasts,
        unreadCount: options?.reset ? 0 : state.unreadCount,
        isLoaded: true,
      }))
    }
  },

  markAsRead: async (notificationId) => {
    const updated = await notificationService.markAsRead(notificationId)
    if (!updated) {
      return
    }

    set((state) => {
      const target = state.notifications.find((item) => item.id === notificationId)
      if (!target) {
        return state
      }

      const notifications = state.notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item,
      )
      const unreadCount = target.read ? state.unreadCount : Math.max(0, state.unreadCount - 1)

      return {
        notifications,
        unreadCount,
      }
    })
  },

  markAllAsRead: async () => {
    const notifications = await notificationService.markAllAsRead()
    set({
      notifications,
      unreadCount: 0,
    })
  },

  dismissToast: (notificationId) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== notificationId),
    }))
  },

  reset: () => set({ ...initialState }),
}))
