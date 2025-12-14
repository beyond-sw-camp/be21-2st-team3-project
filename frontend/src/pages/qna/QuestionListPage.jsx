import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { qnaApi } from '../../api/qna.api'
import useAuthStore from '../../store/authStore'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`

const SearchBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const QuestionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const QuestionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`

const AnsweredBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme, $answered }) => 
    $answered ? theme.colors.successLight : theme.colors.warningLight};
  color: ${({ theme, $answered }) => 
    $answered ? theme.colors.success : theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const QuestionContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const QuestionMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const QuestionListPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const userRole = user?.role
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ questionTitle: '', questionContent: '' })

  const isTrainer = userRole === 'TRAINER'

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true)
      try {
        // 트레이너인 경우 미답변 질문 조회, 일반 유저는 내 질문 조회
        const response = userRole === 'TRAINER'
          ? await qnaApi.getUnansweredQuestions()
          : await qnaApi.getMyQuestions()
        // 최신순 정렬 (questionId 또는 createdAt 기준)
        const sortedQuestions = (response.data || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt)
          }
          return (b.questionId || 0) - (a.questionId || 0)
        })
        setQuestions(sortedQuestions)
      } catch (error) {
        console.error('질문 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [userRole])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // 검색어가 없으면 다시 기본 목록 불러오기
      setIsLoading(true)
      try {
        const response = userRole === 'TRAINER'
          ? await qnaApi.getUnansweredQuestions()
          : await qnaApi.getMyQuestions()
        const sortedQuestions = (response.data || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt)
          }
          return (b.questionId || 0) - (a.questionId || 0)
        })
        setQuestions(sortedQuestions)
      } catch (error) {
        console.error('질문 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await qnaApi.searchQuestions(searchQuery)
      const sortedQuestions = (response.data || []).sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return (b.questionId || 0) - (a.questionId || 0)
      })
      setQuestions(sortedQuestions)
    } catch (error) {
      console.error('검색 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateQuestion = () => {
    setFormData({ questionTitle: '', questionContent: '' })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    try {
      await qnaApi.createQuestion(formData.questionTitle, formData.questionContent)
      setShowModal(false)
      // 질문 목록 새로고침
      setIsLoading(true)
      const response = userRole === 'TRAINER'
        ? await qnaApi.getUnansweredQuestions()
        : await qnaApi.getMyQuestions()
      const sortedQuestions = (response.data || []).sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return (b.questionId || 0) - (a.questionId || 0)
      })
      setQuestions(sortedQuestions)
      setIsLoading(false)
    } catch (error) {
      console.error('질문 작성 실패:', error)
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (questionId) => {
    navigate(`/qna/${questionId}`)
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>{isTrainer ? '미답변 질문 목록' : 'Q&A 커뮤니티'}</PageTitle>
        {!isTrainer && <Button onClick={handleCreateQuestion}>질문하기</Button>}
      </PageHeader>

      <SearchBar>
        <SearchInput
          placeholder="키워드로 검색하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
      </SearchBar>

      {isLoading ? (
        <LoadingSpinner text="질문 로딩 중..." />
      ) : questions.length === 0 ? (
        <EmptyState
          icon="❓"
          title={isTrainer ? '미답변 질문이 없습니다' : '질문이 없습니다'}
          description={isTrainer ? '모든 질문에 답변이 완료되었습니다!' : '첫 번째 질문을 작성해보세요!'}
        />
      ) : (
        <QuestionList>
          {questions.map((question) => (
            <QuestionCard 
              key={question.questionId}
              onClick={() => handleQuestionClick(question.questionId)}
            >
              <QuestionHeader>
                <QuestionTitle>{question.questionTitle}</QuestionTitle>
                <AnsweredBadge $answered={question.isAnswered}>
                  {question.isAnswered ? '답변완료' : '답변대기'}
                </AnsweredBadge>
              </QuestionHeader>
              <QuestionContent>{question.questionContent}</QuestionContent>
              <QuestionMeta>
                <span>작성자: 사용자 {question.userId}</span>
              </QuestionMeta>
            </QuestionCard>
          ))}
        </QuestionList>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="새 질문 작성"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button onClick={handleSubmit}>등록</Button>
          </>
        }
      >
        <FormGroup>
          <Input
            label="제목"
            value={formData.questionTitle}
            onChange={(e) => setFormData({ ...formData, questionTitle: e.target.value })}
            placeholder="질문 제목을 입력하세요"
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="내용"
            multiline
            value={formData.questionContent}
            onChange={(e) => setFormData({ ...formData, questionContent: e.target.value })}
            placeholder="질문 내용을 자세히 작성해주세요"
          />
        </FormGroup>
      </Modal>
    </PageWrapper>
  )
}

export default QuestionListPage
