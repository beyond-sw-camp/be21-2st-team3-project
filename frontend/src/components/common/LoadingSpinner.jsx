import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
`

const Spinner = styled.div`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '24px'
      case 'lg': return '48px'
      default: return '32px'
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '24px'
      case 'lg': return '48px'
      default: return '32px'
    }
  }};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const LoadingSpinner = ({ size = 'md', text = '로딩 중...' }) => {
  return (
    <SpinnerWrapper>
      <Spinner $size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerWrapper>
  )
}

export default LoadingSpinner
