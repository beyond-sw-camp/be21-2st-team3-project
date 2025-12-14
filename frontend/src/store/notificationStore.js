import { create } from 'zustand'
import { notificationApi } from '../api/notification.api'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // 전체 알림 조회
  fetchNotifications: async () => {
    set({ isLoading: true, error: null })
    try {
      const notifications = await notificationApi.getNotifications()
      const unreadCount = notifications.filter(n => !n.checkNotification).length
      set({ notifications, unreadCount, isLoading: false })
      return notifications
    } catch (error) {
      set({ isLoading: false, error: '알림을 불러오는데 실패했습니다.' })
      throw error
    }
  },

  // 미확인 알림 조회
  fetchUnreadNotifications: async () => {
    set({ isLoading: true, error: null })
    try {
      const notifications = await notificationApi.getUnreadNotifications()
      set({ unreadCount: notifications.length, isLoading: false })
      return notifications
    } catch (error) {
      set({ isLoading: false, error: '알림을 불러오는데 실패했습니다.' })
      throw error
    }
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId)
      
      // 로컬 상태 업데이트
      const { notifications } = get()
      const updatedNotifications = notifications.map(n =>
        n.notificationId === notificationId
          ? { ...n, checkNotification: true }
          : n
      )
      const unreadCount = updatedNotifications.filter(n => !n.checkNotification).length
      
      set({ notifications: updatedNotifications, unreadCount })
    } catch (error) {
      set({ error: '알림 읽음 처리에 실패했습니다.' })
      throw error
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null }),
}))

export default useNotificationStore
