import api from './axios'

const QNA_BASE = '/api/v1/qna-service'

export const qnaApi = {
  // 질문 작성
  createQuestion: async (questionTitle, questionContent) => {
    const response = await api.post(`${QNA_BASE}/question/`, {
      questionTitle,
      questionContent,
    })
    return response.data
  },

  // 키워드로 질문 검색
  searchQuestions: async (keyword) => {
    const response = await api.get(`${QNA_BASE}/question/search`, {
      params: { keyword },
    })
    return response.data
  },

  // 내 질문 조회
  getMyQuestions: async () => {
    const response = await api.get(`${QNA_BASE}/question/search/myQuestion`)
    return response.data
  },

  // 모든 질문 조회
  getAllQuestions: async () => {
    const response = await api.get(`${QNA_BASE}/question/search/all`)
    return response.data
  },

  // 미답변 질문 조회 (트레이너 전용)
  getUnansweredQuestions: async () => {
    const response = await api.get(`${QNA_BASE}/question/search/unanswered`)
    return response.data
  },

  // 질문 상세 조회 (트레이너 전용)
  getQuestionById: async (questionId) => {
    const response = await api.get(`${QNA_BASE}/question/${questionId}`)
    return response.data
  },

  // 질문 수정
  updateQuestion: async (questionId, questionTitle, questionContent) => {
    const response = await api.patch(`${QNA_BASE}/question/${questionId}`, {
      questionTitle,
      questionContent,
    })
    return response.data
  },

  // 질문 삭제
  deleteQuestion: async (questionId) => {
    const response = await api.delete(`${QNA_BASE}/question/${questionId}`)
    return response.data
  },

  // 답변 작성 (트레이너 전용)
  createAnswer: async (questionId, answerContent) => {
    const response = await api.post(`${QNA_BASE}/answer`, { answerContent }, {
      params: { questionId },
    })
    return response.data
  },

  // 질문별 답변 조회
  getAnswersByQuestionId: async (questionId) => {
    const response = await api.get(`${QNA_BASE}/answer/search/questionId`, {
      params: { questionId },
    })
    return response.data
  },

  // 답변 수정
  updateAnswer: async (answerId, questionId, answerContent) => {
    const response = await api.patch(`${QNA_BASE}/answer/${answerId}`, { answerContent }, {
      params: { questionId },
    })
    return response.data
  },

  // 답변 삭제
  deleteAnswer: async (answerId, questionId) => {
    const response = await api.delete(`${QNA_BASE}/answer/${answerId}`, {
      params: { questionId },
    })
    return response.data
  },
}

export default qnaApi
