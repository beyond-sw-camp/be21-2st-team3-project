import { useState } from 'react'
import styled from 'styled-components'
import useAuthStore from '../../store/authStore'
import useNotificationStore from '../../store/notificationStore'
import NotificationDropdown from '../notification/NotificationDropdown'

const NavbarWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const NavbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const NotificationButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 20px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`

const UserRole = styled.span`
  margin-left : 10px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const LogoutButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.error};
  }
`

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const getRoleText = (role) => {
    switch (role) {
      case 'TRAINER': return '트레이너'
      case 'ADMIN': return '관리자'
      default: return '일반 회원'
    }
  }

  return (
    <NavbarWrapper>
      <NavbarLeft>
        <PageTitle>운할</PageTitle>
      </NavbarLeft>

      <NavbarRight>
        <NotificationButton onClick={() => setShowNotifications(!showNotifications)}>
          🔔
          {unreadCount > 0 && (
            <NotificationBadge>
              {unreadCount > 99 ? '99+' : unreadCount}
            </NotificationBadge>
          )}
        </NotificationButton>

        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}

        <UserInfo>
          <UserAvatar>
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </UserAvatar>
          <div>
            <UserName>{user?.username || '사용자'}</UserName>
            <UserRole>{getRoleText(user?.role)}</UserRole>
          </div>
        </UserInfo>

        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </NavbarRight>
    </NavbarWrapper>
  )
}

export default Navbar
