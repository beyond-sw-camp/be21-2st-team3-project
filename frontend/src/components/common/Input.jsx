import styled from 'styled-components'

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? theme.colors.errorLight : theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? theme.colors.errorLight : theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`

const Input = ({ 
  label, 
  error, 
  multiline = false,
  ...props 
}) => {
  const InputComponent = multiline ? StyledTextarea : StyledInput

  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <InputComponent $hasError={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  )
}

export default Input
