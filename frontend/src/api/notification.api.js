import api from './axios'

const NOTIFICATION_BASE = '/api/v1/notification-service/notification'

export const notificationApi = {
  // 전체 알림 조회
  getNotifications: async () => {
    const response = await api.get(NOTIFICATION_BASE)
    return response.data
  },

  // 미확인 알림 조회
  getUnreadNotifications: async () => {
    const response = await api.get(`${NOTIFICATION_BASE}/unread`)
    return response.data
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    const response = await api.patch(`${NOTIFICATION_BASE}/read`, {
      notificationId,
    })
    return response.data
  },
}

export default notificationApi
