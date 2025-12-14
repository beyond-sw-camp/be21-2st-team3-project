import api from './axios'

const REPORT_BASE = '/api/v1/report-service/report'

export const reportApi = {
  // 지난주 분석 리포트 생성 (대시보드에서 호출)
  createLastWeekReport: async () => {
    const response = await api.post(`${REPORT_BASE}/last-week-report`)
    return response.data
  },

  // 전체 리포트 조회
  getAllReports: async () => {
    const response = await api.get(`${REPORT_BASE}/all-report`)
    return response.data
  },

  // 날짜별 리포트 조회
  getReportByDate: async (date) => {
    const response = await api.get(`${REPORT_BASE}/search-report/${date}`)
    return response.data
  },

  // 리포트 삭제
  deleteReport: async (reportId) => {
    const response = await api.delete(`${REPORT_BASE}/delete/${reportId}`)
    return response.data
  },
}

export default reportApi
