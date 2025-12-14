import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { TokenService } from '../../api/axios'

const LandingPage = () => {
  const navigate = useNavigate()

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    const token = TokenService.getAccessToken()
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <Container>
      <Header>
        <Logo>🏋️ 운동할래?</Logo>
        <Nav>
          <NavLink to="/login">로그인</NavLink>
          <SignupButton to="/signup">회원가입</SignupButton>
        </Nav>
      </Header>

      <Hero>
        <HeroContent>
          <HeroTitle>
            운동을 건너뛴 날,<br />
            얼마나 손해봤을까?
          </HeroTitle>
          <HeroSubtitle>
            "What if I hadn't skipped my workout?"<br />
            운동하지 않은 날의 기회 비용을 데이터로 확인하고<br />
            동기를 얻어보세요.
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/signup">무료로 시작하기</PrimaryButton>
            <SecondaryButton to="/login">로그인</SecondaryButton>
          </HeroButtons>
        </HeroContent>
      </Hero>

      <Features>
        <SectionTitle>주요 기능</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>What-if 분석</FeatureTitle>
            <FeatureDesc>
              운동을 건너뛴 날의 기회 비용을 시각화하여 동기를 부여합니다.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>운동 계획</FeatureTitle>
            <FeatureDesc>
              달력 기반으로 운동 계획을 세우고 체계적으로 관리하세요.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🏆</FeatureIcon>
            <FeatureTitle>통계 & 랭킹</FeatureTitle>
            <FeatureDesc>
              주간 운동 통계와 다른 사용자들과의 랭킹을 확인하세요.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureTitle>Q&A 커뮤니티</FeatureTitle>
            <FeatureDesc>
              전문 트레이너에게 운동 관련 질문을 하고 답변을 받으세요.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📸</FeatureIcon>
            <FeatureTitle>소셜 피드</FeatureTitle>
            <FeatureDesc>
              운동 경험을 공유하고 다른 사용자들과 소통하세요.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔔</FeatureIcon>
            <FeatureTitle>알림</FeatureTitle>
            <FeatureDesc>
              질문에 대한 답변 등 중요한 업데이트를 놓치지 마세요.
            </FeatureDesc>
          </FeatureCard>
        </FeatureGrid>
      </Features>

      <Footer>
        <FooterText>© 2025 아무래도 All rights reserved.</FooterText>
      </Footer>
    </Container>
  )
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const SignupButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`

const Hero = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryHover} 100%);
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
`

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.3;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`

const PrimaryButton = styled(Link)`
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

const SecondaryButton = styled(Link)`
  background: transparent;
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid white;
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const Features = styled.section`
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const FeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`

const Footer = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

export default LandingPage
