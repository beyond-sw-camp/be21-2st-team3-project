import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const SidebarWrapper = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: 100;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Nav = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const NavSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`

const NavIcon = styled.span`
  font-size: 20px;
`

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <Logo>
        <LogoText>
          🏋️ 운할
        </LogoText>
      </Logo>
      
      <Nav>
        <NavSection>
          <NavSectionTitle>메인</NavSectionTitle>
          <NavItem to="/dashboard">
            <NavIcon>📊</NavIcon>
            대시보드
          </NavItem>
          <NavItem to="/whatif">
            <NavIcon>🤔</NavIcon>
            What-if 분석
          </NavItem>
          <NavItem to="/stats">
            <NavIcon>📈</NavIcon>
            운동 통계
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>관리</NavSectionTitle>
          <NavItem to="/plan">
            <NavIcon>📅</NavIcon>
            운동 계획
          </NavItem>
          <NavItem to="/diet">
            <NavIcon>🍽️</NavIcon>
            식단 관리
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>커뮤니티</NavSectionTitle>
          <NavItem to="/feed">
            <NavIcon>📝</NavIcon>
            소셜 피드
          </NavItem>
          <NavItem to="/qna">
            <NavIcon>❓</NavIcon>
            Q&A
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>설정</NavSectionTitle>
          <NavItem to="/profile">
            <NavIcon>👤</NavIcon>
            마이페이지
          </NavItem>
        </NavSection>
      </Nav>
    </SidebarWrapper>
  )
}

export default Sidebar
