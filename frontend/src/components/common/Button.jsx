import styled, { css } from 'styled-components'

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background};
          }
        `
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: white;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryLight};
          }
        `
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
        `
    }
  }}

  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.fontSizes.sm};
        `
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.fontSizes.lg};
        `
      default:
        return ''
    }
  }}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  ...props 
}) => {
  return (
    <StyledButton 
      $variant={variant} 
      $size={size} 
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  )
}

export default Button
