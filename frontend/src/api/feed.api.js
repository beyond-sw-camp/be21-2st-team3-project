import api from './axios'

const FEED_BASE = '/api/v1/feed-service/feed'

export const feedApi = {
  // 피드 작성 (multipart/form-data)
  createFeed: async (feedTitle, feedContent, image = null) => {
    const formData = new FormData()
    formData.append('feed', new Blob([JSON.stringify({ feedTitle, feedContent })], { type: 'application/json' }))
    if (image) {
      formData.append('image', image)
    }
    
    const response = await api.post(FEED_BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // 제목으로 검색
  searchByTitle: async (feedTitle) => {
    const response = await api.get(`${FEED_BASE}/search/title`, {
      params: { feedTitle },
    })
    return response.data
  },

  // 내용으로 검색
  searchByContent: async (feedContent) => {
    const response = await api.get(`${FEED_BASE}/search/content`, {
      params: { feedContent },
    })
    return response.data
  },

  // 내 피드 조회
  getMyFeeds: async () => {
    const response = await api.get(`${FEED_BASE}/search/user`)
    return response.data
  },

  // 피드 수정
  updateFeed: async (feedId, feedTitle, feedContent, image = null) => {
    const formData = new FormData()
    formData.append('feed', new Blob([JSON.stringify({ feedTitle, feedContent })], { type: 'application/json' }))
    if (image) {
      formData.append('image', image)
    }
    
    const response = await api.patch(`${FEED_BASE}/${feedId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // 피드 삭제
  deleteFeed: async (feedId) => {
    const response = await api.delete(`${FEED_BASE}/${feedId}`)
    return response.data
  },
}

export default feedApi
