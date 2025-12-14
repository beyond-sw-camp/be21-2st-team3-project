import { create } from 'zustand'
import { authApi } from '../api/auth.api'
import { TokenService } from '../api/axios'

const useAuthStore = create((set, get) => ({
  user: TokenService.getUser(),
  isAuthenticated: !!TokenService.getAccessToken(),
  isLoading: false,
  error: null,

  // 회원가입
  signup: async (id, password, role) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.signup(id, password, role)
      set({ isLoading: false })
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  // 로그인
  login: async (id, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.login(id, password)
      
      if (response.status === 'SUCCESS') {
        // 사용자 정보 조회
        const userInfo = await authApi.getUserInfo()
        const user = {
          userId: userInfo.userId,
          username: userInfo.username,
          role: userInfo.role || 'USER',
        }
        TokenService.setUser(user)
        set({ user, isAuthenticated: true, isLoading: false })
      }
      
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  // 로그아웃
  logout: async () => {
    await authApi.logout()
    set({ user: null, isAuthenticated: false, error: null })
  },

  // 사용자 정보 조회
  fetchUserInfo: async () => {
    set({ isLoading: true })
    try {
      const userInfo = await authApi.getUserInfo()
      const user = {
        userId: userInfo.userId,
        username: userInfo.username,
        role: userInfo.role || 'USER',
      }
      TokenService.setUser(user)
      set({ user, isLoading: false })
      return user
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null }),
}))

export default useAuthStore
