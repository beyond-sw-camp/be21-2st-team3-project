/**
 * 검색 필터링 유틸리티
 */

// 피드 검색 필터링
export const filterFeeds = (feeds, searchQuery, searchType = 'all') => {
  if (!searchQuery || !searchQuery.trim()) {
    return feeds
  }

  const query = searchQuery.toLowerCase().trim()

  return feeds.filter((feed) => {
    switch (searchType) {
      case 'title':
        return feed.feedTitle?.toLowerCase().includes(query)
      case 'content':
        return feed.feedContent?.toLowerCase().includes(query)
      case 'user':
        return String(feed.userId).includes(query)
      case 'all':
      default:
        return (
          feed.feedTitle?.toLowerCase().includes(query) ||
          feed.feedContent?.toLowerCase().includes(query) ||
          String(feed.userId).includes(query)
        )
    }
  })
}

// 질문 검색 필터링
export const filterQuestions = (questions, searchQuery, searchType = 'all') => {
  if (!searchQuery || !searchQuery.trim()) {
    return questions
  }

  const query = searchQuery.toLowerCase().trim()

  return questions.filter((question) => {
    switch (searchType) {
      case 'title':
        return question.questionTitle?.toLowerCase().includes(query)
      case 'content':
        return question.questionContent?.toLowerCase().includes(query)
      case 'user':
        return String(question.userId).includes(query)
      case 'all':
      default:
        return (
          question.questionTitle?.toLowerCase().includes(query) ||
          question.questionContent?.toLowerCase().includes(query) ||
          String(question.userId).includes(query)
        )
    }
  })
}

// 검색 결과 하이라이트
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export default {
  filterFeeds,
  filterQuestions,
  highlightSearchTerm,
}
