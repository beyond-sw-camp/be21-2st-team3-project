import { useState, useCallback } from 'react'

/**
 * API 호출 상태 관리를 위한 커스텀 훅
 * isLoading, error, isEmpty 상태를 관리하고 에러 처리를 표준화합니다.
 */
const useApiState = (initialData = null) => {
  const [state, setState] = useState({
    data: initialData,
    isLoading: false,
    error: null,
    statusCode: null,
    isEmpty: false,
  })

  const setLoading = useCallback((isLoading) => {
    setState(prev => ({ ...prev, isLoading, error: null, statusCode: null }))
  }, [])

  const setData = useCallback((data) => {
    const isEmpty = !data || (Array.isArray(data) && data.length === 0)
    setState({
      data,
      isLoading: false,
      error: null,
      statusCode: null,
      isEmpty,
    })
  }, [])

  const setError = useCallback((error) => {
    let errorMessage = '오류가 발생했습니다.'
    let statusCode = null

    if (error.response) {
      statusCode = error.response.status
      errorMessage = error.response.data?.message || getErrorMessage(statusCode)
    } else if (error.request) {
      statusCode = 'network'
      errorMessage = '네트워크 연결을 확인해주세요.'
    } else {
      errorMessage = error.message || '오류가 발생했습니다.'
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      error: errorMessage,
      statusCode,
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      statusCode: null,
      isEmpty: false,
    })
  }, [initialData])

  /**
   * API 호출을 래핑하여 상태를 자동으로 관리합니다.
   * @param {Function} apiCall - API 호출 함수
   * @param {Function} onSuccess - 성공 시 콜백 (선택)
   * @param {Function} onError - 에러 시 콜백 (선택)
   */
  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true)
    try {
      const response = await apiCall()
      const data = response?.data ?? response
      setData(data)
      if (onSuccess) onSuccess(data)
      return data
    } catch (error) {
      setError(error)
      if (onError) onError(error)
      throw error
    }
  }, [setLoading, setData, setError])

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
    execute,
  }
}

/**
 * HTTP 상태 코드에 따른 기본 에러 메시지
 */
const getErrorMessage = (statusCode) => {
  switch (statusCode) {
    case 400:
      return '입력 정보를 확인해주세요.'
    case 401:
      return '로그인이 필요합니다.'
    case 403:
      return '접근 권한이 없습니다.'
    case 404:
      return '요청한 정보를 찾을 수 없습니다.'
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    default:
      return '오류가 발생했습니다.'
  }
}

export default useApiState
