import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 토큰 관리 유틸리티
export const TokenService = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token) => localStorage.setItem('accessToken', token),
  clearTokens: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
}

// Request Interceptor - JWT 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - HTTP 상태 코드별 에러 처리
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          // Bad Request - 잘못된 요청
          console.error('입력 정보를 확인해주세요:', data?.message || '잘못된 요청입니다.')
          break
        case 401:
          // Unauthorized - 토큰 만료 또는 인증 실패
          TokenService.clearTokens()
          window.location.href = '/login'
          break
        case 403:
          // Forbidden - 권한 없음
          console.error('접근 권한이 없습니다.')
          break
        case 404:
          // Not Found - 리소스 없음
          console.error('요청한 정보를 찾을 수 없습니다.')
          break
        case 500:
          // Internal Server Error - 서버 오류
          console.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          break
        default:
          console.error('오류가 발생했습니다:', data?.message || error.message)
      }
    } else if (error.request) {
      // 네트워크 오류 - 응답을 받지 못함
      console.error('네트워크 연결을 확인해주세요.')
    } else {
      // 요청 설정 오류
      console.error('요청 오류:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
