import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAuthStore from '../../store/authStore'
import { statsApi } from '../../api/stats.api'
import { reportApi } from '../../api/report.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const StatIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryHover} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const WelcomeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  opacity: 0.9;
`

const ActionSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const ActionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const ActionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ActionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchData = async () => {
    try {
      const [statsResponse, reportsData] = await Promise.all([
        statsApi.getUserStats().catch(() => ({ data: [] })),
        reportApi.getAllReports().catch(() => ({ data: [] })),
      ])
      
      // 통계 데이터 처리 - 배열 형태로 받아서 합계 계산
      const statsData = statsResponse?.data || statsResponse || []
      const statsArray = Array.isArray(statsData) ? statsData : [statsData]
      
      // 전체 합계 계산
      const totalDuration = statsArray.reduce((sum, stat) => sum + (stat?.totalDuration || 0), 0)
      const totalCalories = statsArray.reduce((sum, stat) => sum + (stat?.totalCalories || 0), 0)
      
      setStats({ totalDuration, totalCalories, weekCount: statsArray.length })
      setReports(reportsData?.data || [])
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 지난주 분석 리포트 생성
  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      await reportApi.createLastWeekReport()
      alert('리포트가 생성되었습니다!')
      fetchData() // 리포트 목록 새로고침
    } catch (error) {
      console.error('리포트 생성 실패:', error)
      alert('리포트 생성에 실패했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  // 지난주 통계 생성
  const handleGenerateStats = async () => {
    setIsGenerating(true)
    try {
      await statsApi.createLastWeekStats()
      alert('통계가 생성되었습니다!')
      fetchData() // 통계 새로고침
    } catch (error) {
      console.error('통계 생성 실패:', error)
      alert('통계 생성에 실패했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getLatestReport = () => {
    if (reports.length === 0) return null
    return reports[0]
  }

  const latestReport = getLatestReport()

  if (isLoading) {
    return <LoadingSpinner text="대시보드 로딩 중..." />
  }

  return (
    <PageWrapper>
      <WelcomeCard>
        <WelcomeTitle>
          안녕하세요, {user?.username || '사용자'}님! 👋
        </WelcomeTitle>
        <WelcomeText>
          오늘도 운동 목표를 향해 함께 달려볼까요?
        </WelcomeText>
      </WelcomeCard>

      <PageHeader>
        <PageTitle>대시보드</PageTitle>
        <PageSubtitle>나의 운동 현황을 한눈에 확인하세요</PageSubtitle>
      </PageHeader>

      <ActionSection>
        <ActionCard>
          <ActionTitle>📊 분석 리포트 생성</ActionTitle>
          <ActionDescription>지난주 운동 데이터를 분석하여 리포트를 생성합니다.</ActionDescription>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? '생성 중...' : '리포트 생성'}
          </Button>
        </ActionCard>
        <ActionCard>
          <ActionTitle>📈 통계 생성</ActionTitle>
          <ActionDescription>지난주 운동 통계를 생성하여 랭킹에 반영합니다.</ActionDescription>
          <Button onClick={handleGenerateStats} disabled={isGenerating}>
            {isGenerating ? '생성 중...' : '통계 생성'}
          </Button>
        </ActionCard>
      </ActionSection>

      <StatsGrid>
        <StatCard>
          <StatIcon>⏱️</StatIcon>
          <StatValue>{stats?.totalDuration || 0}분</StatValue>
          <StatLabel>총 운동 시간</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>🔥</StatIcon>
          <StatValue>{stats?.totalCalories || 0}kcal</StatValue>
          <StatLabel>총 소모 칼로리</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>📊</StatIcon>
          <StatValue>{reports.length}회</StatValue>
          <StatLabel>기록된 주간 리포트</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>🎯</StatIcon>
          <StatValue>
            {latestReport 
              ? `${Math.round((latestReport.achievedAmount / latestReport.plannedAmount) * 100) || 0}%`
              : '-'
            }
          </StatValue>
          <StatLabel>지난주 목표 달성률</StatLabel>
        </StatCard>
      </StatsGrid>
    </PageWrapper>
  )
}

export default DashboardPage
