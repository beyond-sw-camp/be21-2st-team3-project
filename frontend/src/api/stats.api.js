import api from './axios'

const STATS_BASE = '/api/v1/stats-service/stats'

export const statsApi = {
  // 지난주 통계 생성 (운동 통계 페이지에서 호출)
  createLastWeekStats: async () => {
    const response = await api.post(`${STATS_BASE}/last-week-stats`)
    return response.data
  },

  // 사용자별 통계 조회
  getUserStats: async () => {
    const response = await api.get(`${STATS_BASE}/user-stats`)
    return response.data
  },

  // 지난주 운동량 랭킹 조회
  getLastWeekTimeRanking: async () => {
    const response = await api.get(`${STATS_BASE}/last-week-time-ranking`)
    return response.data
  },

  // 지난주 칼로리 소모량 랭킹 조회
  getLastWeekCalorieRanking: async () => {
    const response = await api.get(`${STATS_BASE}/last-week-calorie-ranking`)
    return response.data
  },

  // 날짜별 운동량 랭킹 조회
  getTimeRankingByDate: async (date) => {
    const response = await api.get(`${STATS_BASE}/search-time-ranking/${date}`)
    return response.data
  },

  // 날짜별 칼로리 소모량 랭킹 조회
  getCalorieRankingByDate: async (date) => {
    const response = await api.get(`${STATS_BASE}/search-calorie-ranking/${date}`)
    return response.data
  },
}

export default statsApi
