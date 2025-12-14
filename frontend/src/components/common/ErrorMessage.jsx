import styled from 'styled-components'
import Button from './Button'

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ErrorTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

// HTTP 상태 코드별 에러 정보
const ERROR_CONFIG = {
  400: {
    icon: '📝',
    title: '잘못된 요청',
    message: '입력 정보를 확인해주세요.',
    showRetry: false,
  },
  401: {
    icon: '🔐',
    title: '인증 필요',
    message: '로그인이 필요합니다.',
    showRetry: false,
  },
  403: {
    icon: '🚫',
    title: '접근 거부',
    message: '접근 권한이 없습니다.',
    showRetry: false,
  },
  404: {
    icon: '🔍',
    title: '찾을 수 없음',
    message: '요청한 정보를 찾을 수 없습니다.',
    showRetry: false,
  },
  500: {
    icon: '🔧',
    title: '서버 오류',
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    showRetry: true,
  },
  network: {
    icon: '📡',
    title: '네트워크 오류',
    message: '네트워크 연결을 확인해주세요.',
    showRetry: true,
  },
  default: {
    icon: '⚠️',
    title: '오류 발생',
    message: '오류가 발생했습니다.',
    showRetry: true,
  },
}

const ErrorMessage = ({ 
  message, 
  statusCode,
  onRetry 
}) => {
  // 상태 코드에 따른 에러 설정 가져오기
  const getErrorConfig = () => {
    if (statusCode && ERROR_CONFIG[statusCode]) {
      return ERROR_CONFIG[statusCode]
    }
    if (statusCode === 'network') {
      return ERROR_CONFIG.network
    }
    return ERROR_CONFIG.default
  }

  const config = getErrorConfig()
  const displayMessage = message || config.message
  const showRetryButton = onRetry && config.showRetry

  return (
    <ErrorWrapper>
      <ErrorIcon>{config.icon}</ErrorIcon>
      <ErrorTitle>{config.title}</ErrorTitle>
      <ErrorText>{displayMessage}</ErrorText>
      {showRetryButton && (
        <Button onClick={onRetry} variant="secondary">
          다시 시도
        </Button>
      )}
    </ErrorWrapper>
  )
}

export default ErrorMessage
