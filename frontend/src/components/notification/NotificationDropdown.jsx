import { useEffect } from 'react'
import styled from 'styled-components'
import useNotificationStore from '../../store/notificationStore'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

const DropdownWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  width: 360px;
  max-height: 480px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;
  overflow: hidden;
`

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const DropdownTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const CloseButton = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 18px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const NotificationItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${({ theme, $isRead }) => 
    $isRead ? 'transparent' : theme.colors.primaryLight};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`

const NotificationIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`

const NotificationText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.4;
`

const NotificationTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textLight};
`

const NotificationDropdown = ({ onClose }) => {
  const { notifications, isLoading, fetchNotifications, markAsRead } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleNotificationClick = async (notification) => {
    if (!notification.checkNotification) {
      await markAsRead(notification.notificationId)
    }
  }

  return (
    <DropdownWrapper>
      <DropdownHeader>
        <DropdownTitle>알림</DropdownTitle>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </DropdownHeader>

      <NotificationList>
        {isLoading ? (
          <LoadingSpinner size="sm" text="알림 로딩 중..." />
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon="🔔" 
            title="알림이 없습니다" 
            description="새로운 알림이 없습니다."
          />
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notificationId}
              $isRead={notification.checkNotification}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationIcon>💬</NotificationIcon>
              <NotificationContent>
                <NotificationText>{notification.content}</NotificationText>
                <NotificationTime>
                  {notification.checkNotification ? '읽음' : '읽지 않음'}
                </NotificationTime>
              </NotificationContent>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </DropdownWrapper>
  )
}

export default NotificationDropdown
