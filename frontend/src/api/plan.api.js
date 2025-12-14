import api from './axios'

const PLAN_BASE = '/api/v1/workoutplan-service/workout'

export const planApi = {
  // 운동 계획 생성
  createPlan: async (planData) => {
    const response = await api.post(PLAN_BASE, planData)
    return response.data
  },

  // 날짜별 계획 조회
  getPlansByDate: async (date) => {
    const response = await api.get(PLAN_BASE, {
      params: { date },
    })
    return response.data
  },

  // 날짜별 계획 수정
  updatePlanByDate: async (date, planData) => {
    const response = await api.patch(PLAN_BASE, planData, {
      params: { date },
    })
    return response.data
  },

  // 날짜별 계획 삭제
  deletePlanByDate: async (date) => {
    const response = await api.delete(PLAN_BASE, {
      params: { date },
    })
    return response.data
  },

  // 운동 완료 처리 (isCompleted = true)
  completeWorkout: async (date) => {
    const response = await api.patch(`${PLAN_BASE}/complete?date=${date}`)
    return response.data
  },

  // 주간 운동 계획 데이터 조회 (리포트/통계용)
  getWeeklyPlanValue: async (userId, startDate, endDate) => {
    const response = await api.post(`${PLAN_BASE}/weekly`, {
      userId,
      startDate,
      endDate,
    })
    return response.data
  },

  // 주간 운동 통계 조회 (랭킹용)
  getWeeklyStats: async (userId, startDate, endDate) => {
    const response = await api.post(`${PLAN_BASE}/stats`, {
      userId,
      startDate,
      endDate,
    })
    return response.data
  },
}

export default planApi
