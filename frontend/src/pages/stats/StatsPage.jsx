import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { statsApi } from '../../api/stats.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

// Layout
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const HeaderContent = styled.div``

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #8e8e93;
  font-weight: 400;
`


const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`

// Tabs
const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  background: #f5f5f7;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
`

const Tab = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#1a1a2e' : '#8e8e93')};
  background: ${({ $active }) => ($active ? 'white' : 'transparent')};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ $active }) => ($active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none')};

  &:hover {
    color: #1a1a2e;
  }
`

// Stats Cards Grid
const StatsCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background: ${({ $gradient }) => $gradient || 'white'};
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  animation-fill-mode: both;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover::before {
    opacity: 1;
  }
`

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg || 'rgba(255,255,255,0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
`

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ $light }) => ($light ? 'rgba(255,255,255,0.8)' : '#8e8e93')};
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ $light }) => ($light ? 'white' : '#1a1a2e')};
  letter-spacing: -1px;
`

const StatUnit = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-left: 4px;
  opacity: 0.8;
`


// Chart Section
const ChartSection = styled.div`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
`

const ChartPeriod = styled.div`
  display: flex;
  gap: 8px;
`

const PeriodButton = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? 'white' : '#8e8e93')};
  background: ${({ $active }) => ($active ? '#1a1a2e' : '#f5f5f7')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active }) => ($active ? '#1a1a2e' : '#e5e5ea')};
  }
`

// Ranking Section
const RankingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const RankingCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`

const RankingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`

const RankingIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`

const RankingTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
`

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ $rank }) => {
    if ($rank === 1) return 'linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%)'
    if ($rank === 2) return 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)'
    if ($rank === 3) return 'linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%)'
    return '#fafafa'
  }};
  border-radius: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(4px);
  }
`

const RankBadge = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $rank }) => {
    if ($rank === 1) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
    if ($rank === 2) return 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)'
    if ($rank === 3) return 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)'
    return '#e5e5ea'
  }};
  color: ${({ $rank }) => ($rank <= 3 ? 'white' : '#8e8e93')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: ${({ $rank }) =>
    $rank <= 3 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'};
`

const RankInfo = styled.div`
  flex: 1;
`

const RankName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
`

const RankMeta = styled.div`
  font-size: 13px;
  color: #8e8e93;
`

const RankValueBadge = styled.div`
  padding: 8px 14px;
  background: ${({ $type }) =>
    $type === 'time'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
`


// Empty State
const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  animation: ${pulse} 2s ease-in-out infinite;
`

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
`

const EmptyDescription = styled.p`
  font-size: 15px;
  color: #8e8e93;
  max-width: 300px;
`

// Custom Tooltip
const CustomTooltipWrapper = styled.div`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`

const TooltipLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`

const TooltipValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: white;
`

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipWrapper>
        <TooltipLabel>{label}</TooltipLabel>
        <TooltipValue>{payload[0].value.toLocaleString()}</TooltipValue>
      </CustomTooltipWrapper>
    )
  }
  return null
}

const StatsPage = () => {
  const [activeTab, setActiveTab] = useState('stats')
  const [userStats, setUserStats] = useState([])
  const [timeRanking, setTimeRanking] = useState([])
  const [calorieRanking, setCalorieRanking] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [statsResponse, timeResponse, calorieResponse] = await Promise.all([
        statsApi.getUserStats().catch(() => ({ data: [] })),
        statsApi.getLastWeekTimeRanking().catch(() => ({ data: [] })),
        statsApi.getLastWeekCalorieRanking().catch(() => ({ data: [] })),
      ])

      // 통계 데이터 처리 - 배열 형태로 받음
      const statsData = statsResponse?.data || statsResponse || []
      setUserStats(Array.isArray(statsData) ? statsData : [statsData])

      // 랭킹 데이터 처리
      const timeData = timeResponse?.data || timeResponse || []
      const calorieData = calorieResponse?.data || calorieResponse || []
      setTimeRanking(Array.isArray(timeData) ? timeData : [])
      setCalorieRanking(Array.isArray(calorieData) ? calorieData : [])
    } catch (error) {
      console.error('통계 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGenerateStats = async () => {
    setIsGenerating(true)
    try {
      await statsApi.createLastWeekStats()
      alert('통계가 생성되었습니다!')
      fetchData()
    } catch (error) {
      console.error('통계 생성 실패:', error)
      alert('통계 생성에 실패했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  // 최신 통계 데이터 가져오기
  const latestStats = userStats.length > 0 ? userStats[0] : null
  
  // 전체 합계 계산
  const totalDuration = userStats.reduce((sum, stat) => sum + (stat.totalDuration || 0), 0)
  const totalCalories = userStats.reduce((sum, stat) => sum + (stat.totalCalories || 0), 0)
  const weekCount = userStats.length

  // 차트 데이터 생성 - 날짜 기준 오름차순 정렬 (오른쪽으로 갈수록 최신)
  const chartData = [...userStats]
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate) : new Date(0)
      const dateB = b.startDate ? new Date(b.startDate) : new Date(0)
      return dateA - dateB // 오름차순: 과거 → 최신
    })
    .slice(-8) // 최근 8개만
    .map((stat, index) => ({
      name: stat.startDate ? `${stat.startDate.slice(5)}` : `Week ${index + 1}`,
      duration: stat.totalDuration || 0,
      calories: stat.totalCalories || 0,
    }))

  if (isLoading) {
    return <LoadingSpinner text="통계 로딩 중..." />
  }


  return (
    <PageWrapper>
      <PageHeader>
        <HeaderRow>
          <HeaderContent>
            <PageTitle>운동 통계</PageTitle>
            <PageSubtitle>나의 운동 기록과 순위를 확인하세요</PageSubtitle>
          </HeaderContent>
          <GenerateButton onClick={handleGenerateStats} disabled={isGenerating}>
            {isGenerating ? (
              <>⏳ 생성 중...</>
            ) : (
              <>✨ 지난주 통계 생성</>
            )}
          </GenerateButton>
        </HeaderRow>
      </PageHeader>

      <TabContainer>
        <Tab $active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
          📊 내 통계
        </Tab>
        <Tab $active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')}>
          🏆 순위
        </Tab>
      </TabContainer>

      {activeTab === 'stats' && (
        <>
          <StatsCardsGrid>
            <StatCard
              $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              $delay="0.1s"
            >
              <StatIcon $bg="rgba(255,255,255,0.2)">⏱️</StatIcon>
              <StatLabel $light>총 운동 시간</StatLabel>
              <StatValue $light>
                {totalDuration.toLocaleString()}
                <StatUnit>분</StatUnit>
              </StatValue>
            </StatCard>

            <StatCard
              $gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              $delay="0.2s"
            >
              <StatIcon $bg="rgba(255,255,255,0.2)">🔥</StatIcon>
              <StatLabel $light>총 소모 칼로리</StatLabel>
              <StatValue $light>
                {totalCalories.toLocaleString()}
                <StatUnit>kcal</StatUnit>
              </StatValue>
            </StatCard>

            <StatCard $delay="0.3s">
              <StatIcon $bg="#f0f0ff">📅</StatIcon>
              <StatLabel>기록된 주차</StatLabel>
              <StatValue>
                {weekCount}
                <StatUnit>주</StatUnit>
              </StatValue>
            </StatCard>

            <StatCard $delay="0.4s">
              <StatIcon $bg="#fff0f0">📈</StatIcon>
              <StatLabel>주간 평균</StatLabel>
              <StatValue>
                {weekCount > 0 ? Math.round(totalDuration / weekCount) : 0}
                <StatUnit>분</StatUnit>
              </StatValue>
            </StatCard>
          </StatsCardsGrid>

          {userStats.length === 0 ? (
            <ChartSection>
              <EmptyStateWrapper>
                <EmptyIcon>📊</EmptyIcon>
                <EmptyTitle>통계 데이터가 없습니다</EmptyTitle>
                <EmptyDescription>
                  운동 기록을 등록하고 통계를 생성하면 여기에서 확인할 수 있습니다.
                </EmptyDescription>
              </EmptyStateWrapper>
            </ChartSection>
          ) : (
            <ChartSection>
              <ChartHeader>
                <ChartTitle>주간 운동 추이</ChartTitle>
              </ChartHeader>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8e8e93', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8e8e93', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    stroke="#667eea"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDuration)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartSection>
          )}
        </>
      )}

      {activeTab === 'ranking' && (
        <RankingGrid>
          <RankingCard>
            <RankingHeader>
              <RankingIcon $bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                🏃
              </RankingIcon>
              <RankingTitle>운동 시간 순위</RankingTitle>
            </RankingHeader>
            {timeRanking.length === 0 ? (
              <EmptyStateWrapper>
                <EmptyIcon>🏆</EmptyIcon>
                <EmptyTitle>순위 데이터가 없습니다</EmptyTitle>
                <EmptyDescription>아직 순위 데이터가 없습니다.</EmptyDescription>
              </EmptyStateWrapper>
            ) : (
              <RankingList>
                {timeRanking.slice(0, 10).map((item, index) => (
                  <RankingItem key={item.userId} $rank={index + 1}>
                    <RankBadge $rank={index + 1}>{index + 1}</RankBadge>
                    <RankInfo>
                      <RankName>사용자 {item.userId}</RankName>
                      <RankMeta>#{index + 1} 랭커</RankMeta>
                    </RankInfo>
                    <RankValueBadge $type="time">
                      {item.totalDuration?.toLocaleString()}분
                    </RankValueBadge>
                  </RankingItem>
                ))}
              </RankingList>
            )}
          </RankingCard>

          <RankingCard>
            <RankingHeader>
              <RankingIcon $bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                🔥
              </RankingIcon>
              <RankingTitle>칼로리 소모 순위</RankingTitle>
            </RankingHeader>
            {calorieRanking.length === 0 ? (
              <EmptyStateWrapper>
                <EmptyIcon>🏆</EmptyIcon>
                <EmptyTitle>순위 데이터가 없습니다</EmptyTitle>
                <EmptyDescription>아직 순위 데이터가 없습니다.</EmptyDescription>
              </EmptyStateWrapper>
            ) : (
              <RankingList>
                {calorieRanking.slice(0, 10).map((item, index) => (
                  <RankingItem key={item.userId} $rank={index + 1}>
                    <RankBadge $rank={index + 1}>{index + 1}</RankBadge>
                    <RankInfo>
                      <RankName>사용자 {item.userId}</RankName>
                      <RankMeta>#{index + 1} 랭커</RankMeta>
                    </RankInfo>
                    <RankValueBadge $type="calorie">
                      {item.totalCalories?.toLocaleString()}kcal
                    </RankValueBadge>
                  </RankingItem>
                ))}
              </RankingList>
            )}
          </RankingCard>
        </RankingGrid>
      )}
    </PageWrapper>
  )
}

export default StatsPage
