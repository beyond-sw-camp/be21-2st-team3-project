import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { reportApi } from '../../api/report.api'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

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

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const ResultCard = styled.div`
  background: ${({ theme, $positive }) => 
    $positive 
      ? `linear-gradient(135deg, ${theme.colors.success} 0%, #059669 100%)`
      : `linear-gradient(135deg, ${theme.colors.error} 0%, #DC2626 100%)`
  };
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: white;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const ResultTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ResultValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ResultDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  opacity: 0.9;
`

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const ReportInfo = styled.div`
  flex: 1;
`

const ReportDate = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const ReportStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ReportResult = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme, $positive }) => $positive ? theme.colors.success : theme.colors.error};
`

const WhatIfPage = () => {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const response = await reportApi.getAllReports()
      setReports(response.data || [])
    } catch (error) {
      console.error('리포트 로딩 실패:', error)
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      await reportApi.deleteReport(reportId)
      fetchReports()
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  const getLatestReport = () => {
    if (reports.length === 0) return null
    return reports[0]
  }

  const latestReport = getLatestReport()

  const chartData = latestReport ? [
    { name: '계획량', value: latestReport.plannedAmount, fill: '#4F46E5' },
    { name: '달성량', value: latestReport.achievedAmount, fill: '#10B981' },
    { name: '차이', value: Math.abs(latestReport.resultValue), fill: latestReport.resultValue >= 0 ? '#EF4444' : '#22C55E' },
  ] : []

  if (isLoading) {
    return <LoadingSpinner text="분석 데이터 로딩 중..." />
  }

  if (reports.length === 0) {
    return (
      <PageWrapper>
        <PageHeader>
          <PageTitle>🤔 What-if 분석</PageTitle>
          <PageSubtitle>운동하지 않은 날의 기회 비용을 확인하세요</PageSubtitle>
        </PageHeader>
        <EmptyState
          icon="📊"
          title="분석할 데이터가 없습니다"
          description="운동 기록을 등록하면 What-if 분석을 확인할 수 있습니다."
        />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>🤔 What-if 분석</PageTitle>
        <PageSubtitle>운동하지 않은 날의 기회 비용을 확인하세요</PageSubtitle>
      </PageHeader>

      {latestReport && (
        <ResultCard $positive={latestReport.resultValue <= 0}>
          <ResultTitle>
            {latestReport.resultValue > 0 
              ? '아쉬워요! 목표를 달성하지 못했어요 😢'
              : '축하해요! 목표를 달성했어요 🎉'
            }
          </ResultTitle>
          <ResultValue>
            {latestReport.resultValue > 0 ? '+' : ''}{latestReport.resultValue}
          </ResultValue>
          <ResultDescription>
            계획: {latestReport.plannedAmount} | 달성: {latestReport.achievedAmount}
          </ResultDescription>
        </ResultCard>
      )}

      <ChartCard>
        <ChartTitle>지난주 분석 결과</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard>
        <ChartTitle>전체 기록</ChartTitle>
        <ReportList>
          {reports.map((report, index) => (
            <ReportItem key={index}>
              <ReportInfo>
                <ReportDate>
                  {report.startDate} ~ {report.endDate}
                </ReportDate>
                <ReportStats>
                  <span>계획: {report.plannedAmount}</span>
                  <span>달성: {report.achievedAmount}</span>
                </ReportStats>
              </ReportInfo>
              <ReportResult $positive={report.resultValue <= 0}>
                {report.resultValue > 0 ? '+' : ''}{report.resultValue}
              </ReportResult>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteReport(report.reportId)}
              >
                삭제
              </Button>
            </ReportItem>
          ))}
        </ReportList>
      </ChartCard>
    </PageWrapper>
  )
}

export default WhatIfPage
