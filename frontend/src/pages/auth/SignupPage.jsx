import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useAuthStore from '../../store/authStore'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
`

const SignupCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing['2xl']};
`

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const LogoSubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const ErrorAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const SuccessAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.successLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const RoleSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const RoleLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`

const RoleOptions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const RoleOption = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $selected }) => 
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  color: ${({ theme, $selected }) => 
    $selected ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ theme, $selected }) => 
    $selected ? theme.fontWeights.semibold : theme.fontWeights.normal};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const RoleIcon = styled.div`
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const RoleName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
  }
`

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  })
  const [formErrors, setFormErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const errors = {}
    if (!formData.id.trim()) {
      errors.id = '아이디를 입력해주세요.'
    } else if (formData.id.length < 4) {
      errors.id = '아이디는 4자 이상이어야 합니다.'
    }
    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 6) {
      errors.password = '비밀번호는 6자 이상이어야 합니다.'
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) {
      clearError()
    }
  }

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await signup(formData.id, formData.password, formData.role)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      // 에러는 store에서 처리됨
    }
  }

  return (
    <PageWrapper>
      <SignupCard>
        <Logo>
          <LogoText>🏋️ 운할</LogoText>
          <LogoSubtext>새로운 운동 여정을 시작하세요</LogoSubtext>
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}
          {success && <SuccessAlert>회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.</SuccessAlert>}

          <Input
            label="아이디"
            name="id"
            type="text"
            placeholder="아이디를 입력하세요 (4자 이상)"
            value={formData.id}
            onChange={handleChange}
            error={formErrors.id}
          />

          <Input
            label="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요 (6자 이상)"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
          />

          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
          />

          <RoleSelector>
            <RoleLabel>회원 유형</RoleLabel>
            <RoleOptions>
              <RoleOption
                type="button"
                $selected={formData.role === 'USER'}
                onClick={() => handleRoleSelect('USER')}
              >
                <RoleIcon>🏃</RoleIcon>
                <RoleName>일반 회원</RoleName>
              </RoleOption>
              <RoleOption
                type="button"
                $selected={formData.role === 'TRAINER'}
                onClick={() => handleRoleSelect('TRAINER')}
              >
                <RoleIcon>💪</RoleIcon>
                <RoleName>트레이너</RoleName>
              </RoleOption>
            </RoleOptions>
          </RoleSelector>

          <Button type="submit" fullWidth disabled={isLoading || success}>
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>
        </Form>

        <Footer>
          이미 계정이 있으신가요? <FooterLink to="/login">로그인</FooterLink>
        </Footer>
      </SignupCard>
    </PageWrapper>
  )
}

export default SignupPage
