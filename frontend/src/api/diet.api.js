import api from './axios'

const DIET_BASE = '/api/v1/dietplan-service/dietplan'

export const dietApi = {
  // 식단 계획 생성 (이미지 포함 - multipart/form-data)
  createDietPlan: async (dietPlanData, image = null) => {
    const formData = new FormData()
    formData.append('diet', new Blob([JSON.stringify(dietPlanData)], { type: 'application/json' }))
    if (image) {
      formData.append('image', image)
    }
    const response = await api.post(DIET_BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // 날짜별 식단 계획 조회
  getDietPlanByDate: async (date) => {
    const response = await api.get(`${DIET_BASE}/search/date`, {
      params: { date },
    })
    return response.data
  },

  // 식단 계획 수정 (이미지 포함 - multipart/form-data)
  updateDietPlan: async (dietPlanId, dietPlanData, image = null) => {
    const formData = new FormData()
    formData.append('diet', new Blob([JSON.stringify(dietPlanData)], { type: 'application/json' }))
    if (image) {
      formData.append('image', image)
    }
    const response = await api.patch(`${DIET_BASE}/${dietPlanId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // 식단 계획 삭제
  deleteDietPlan: async (dietPlanId) => {
    const response = await api.delete(`${DIET_BASE}/${dietPlanId}`)
    return response.data
  },
}

export default dietApi
