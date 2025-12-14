import styled from 'styled-components'

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 400px;
`

const EmptyState = ({ 
  icon = '📭', 
  title = '데이터가 없습니다', 
  description = '아직 등록된 내용이 없습니다.',
  children 
}) => {
  return (
    <EmptyWrapper>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
      {children}
    </EmptyWrapper>
  )
}

export default EmptyState
