import api, { TokenService } from './axios'

const AUTH_BASE = '/api/v1/member-service'

export const authApi = {
  /**
   * 회원가입
   * POST /api/v1/member-service/auth/signup
   * Body: { id: string, password: string, role: 'USER' | 'TRAINER' }
   * Response: { status: 'SUCCESS', message: string, data: accessToken }
   */
  signup: async (id, password, role) => {
    const response = await api.post(`${AUTH_BASE}/auth/signup`, {
      id,
      password,
      role,
    })
    return response.data
  },

  /**
   * 로그인
   * POST /api/v1/member-service/auth/login
   * Body: { id: string, password: string }
   * Response: { status: 'SUCCESS', message: string, data: accessToken }
   */
  login: async (id, password) => {
    const response = await api.post(`${AUTH_BASE}/auth/login`, {
      id,
      password,
    })
    
    // 토큰 저장 (data 필드에 accessToken 문자열이 직접 들어옴)
    if (response.data.status === 'SUCCESS' && response.data.data) {
      TokenService.setAccessToken(response.data.data)
    }
    
    return response.data
  },

  /**
   * 로그아웃
   * POST /api/v1/member-service/auth/logout
   * Headers: Authorization: Bearer {token}
   */
  logout: async () => {
    const token = TokenService.getAccessToken()
    try {
      await api.post(`${AUTH_BASE}/auth/logout`, null, {
        headers: {
          Authorization: `${token}`
        }
      })
    } catch (error) {
      console.error('로그아웃 API 실패:', error)
    } finally {
      TokenService.clearTokens()
    }
  },

  /**
   * 회원 정보 조회
   * GET /api/v1/member-service/member
   * Headers: Authorization: Bearer {token}
   * Response: { userId: number, username: string }
   */
  getUserInfo: async () => {
    const response = await api.get(`${AUTH_BASE}/member`)
    return response.data.data
  },
}

export default authApi
