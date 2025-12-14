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

const LoginCard = styled.div`
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

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!formData.id.trim()) {
      errors.id = '아이디를 입력해주세요.'
    }
    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login(formData.id, formData.password)
      console.log('id' + formData.id + ' 로그인 성공')
      console.log('토큰 ' + localStorage.getItem('token'))
      navigate('/dashboard')
    } catch (err) {
      // 에러는 store에서 처리됨
    }
  }

  return (
    <PageWrapper>
      <LoginCard>
        <Logo>
          <LogoText>🏋️ 운할</LogoText>
          <LogoSubtext>What if I hadn't skipped my workout?</LogoSubtext>
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}

          <Input
            label="아이디"
            name="id"
            type="text"
            placeholder="아이디를 입력하세요"
            value={formData.id}
            onChange={handleChange}
            error={formErrors.id}
          />

          <Input
            label="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
          />

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>

        <Footer>
          계정이 없으신가요? <FooterLink to="/signup">회원가입</FooterLink>
        </Footer>
      </LoginCard>
    </PageWrapper>
  )
}

export default LoginPage
