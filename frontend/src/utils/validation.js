/**
 * 폼 유효성 검사 유틸리티
 */

// 필수 필드 검사
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

// 최소 길이 검사
export const minLength = (value, min) => {
  if (typeof value !== 'string') return false
  return value.length >= min
}

// 최대 길이 검사
export const maxLength = (value, max) => {
  if (typeof value !== 'string') return false
  return value.length <= max
}

// 이메일 형식 검사
export const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

// 비밀번호 일치 검사
export const isPasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword
}

// 회원가입 폼 유효성 검사
export const validateSignupForm = (formData) => {
  const errors = {}

  if (!isRequired(formData.id)) {
    errors.id = '아이디를 입력해주세요.'
  } else if (!minLength(formData.id, 4)) {
    errors.id = '아이디는 4자 이상이어야 합니다.'
  }

  if (!isRequired(formData.password)) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (!minLength(formData.password, 6)) {
    errors.password = '비밀번호는 6자 이상이어야 합니다.'
  }

  if (!isPasswordMatch(formData.password, formData.confirmPassword)) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
  }

  if (!isRequired(formData.role)) {
    errors.role = '회원 유형을 선택해주세요.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// 로그인 폼 유효성 검사
export const validateLoginForm = (formData) => {
  const errors = {}

  if (!isRequired(formData.id)) {
    errors.id = '아이디를 입력해주세요.'
  }

  if (!isRequired(formData.password)) {
    errors.password = '비밀번호를 입력해주세요.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// 피드 폼 유효성 검사
export const validateFeedForm = (formData) => {
  const errors = {}

  if (!isRequired(formData.feedTitle)) {
    errors.feedTitle = '제목을 입력해주세요.'
  }

  if (!isRequired(formData.feedContent)) {
    errors.feedContent = '내용을 입력해주세요.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// 질문 폼 유효성 검사
export const validateQuestionForm = (formData) => {
  const errors = {}

  if (!isRequired(formData.questionTitle)) {
    errors.questionTitle = '제목을 입력해주세요.'
  }

  if (!isRequired(formData.questionContent)) {
    errors.questionContent = '내용을 입력해주세요.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export default {
  isRequired,
  minLength,
  maxLength,
  isEmail,
  isPasswordMatch,
  validateSignupForm,
  validateLoginForm,
  validateFeedForm,
  validateQuestionForm,
}
