import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { qnaApi } from '../../api/qna.api'
import useAuthStore from '../../store/authStore'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const QuestionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const QuestionTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`

const QuestionActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const QuestionContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  white-space: pre-wrap;
`

const QuestionMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`

const AnswersSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const AnswerCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-left: 4px solid ${({ theme }) => theme.colors.secondary};
`

const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const AnswerAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const TrainerBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.secondaryLight || '#D1FAE5'};
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const AnswerContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  white-space: pre-wrap;
`

const AnswerForm = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`

const QuestionDetailPage = () => {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const userRole = user?.role
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState('')

  const isTrainer = userRole === 'TRAINER'
  const isOwner = question?.userId === user?.userId
  const canEdit = isOwner && !question?.isAnswered

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData 호출됨, questionId:', questionId, 'userRole:', userRole)
      setIsLoading(true)
      try {
        // 트레이너인 경우 질문 상세 조회 API 사용, 일반 유저는 내 질문에서 찾기
        if (userRole === 'TRAINER') {
          console.log('트레이너 API 호출: getQuestionById')
          const questionResponse = await qnaApi.getQuestionById(questionId)
          console.log('트레이너 API 응답:', questionResponse)
          setQuestion(questionResponse.data)
        } else {
          console.log('일반 유저 API 호출: getMyQuestions')
          const questionsResponse = await qnaApi.getMyQuestions()
          const foundQuestion = questionsResponse.data?.find(q => q.questionId === parseInt(questionId))
          setQuestion(foundQuestion)
        }

        // 답변 조회
        const answersResponse = await qnaApi.getAnswersByQuestionId(questionId)
        setAnswers(answersResponse.data || [])
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [questionId, userRole])

  const handleDeleteQuestion = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      await qnaApi.deleteQuestion(questionId)
      navigate('/qna')
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) return

    try {
      await qnaApi.createAnswer(questionId, answerContent)
      setAnswerContent('')
      // 답변 목록 새로고침
      const answersResponse = await qnaApi.getAnswersByQuestionId(questionId)
      setAnswers(answersResponse.data || [])
    } catch (error) {
      console.error('답변 작성 실패:', error)
    }
  }

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      await qnaApi.deleteAnswer(answerId, questionId)
      const answersResponse = await qnaApi.getAnswersByQuestionId(questionId)
      setAnswers(answersResponse.data || [])
    } catch (error) {
      console.error('답변 삭제 실패:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner text="질문 로딩 중..." />
  }

  if (!question) {
    return (
      <PageWrapper>
        <EmptyState
          icon="❓"
          title="질문을 찾을 수 없습니다"
          description="요청하신 질문이 존재하지 않습니다."
        />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate('/qna')}>
        ← 목록으로 돌아가기
      </BackButton>

      <QuestionCard>
        <QuestionHeader>
          <QuestionTitle>{question.questionTitle}</QuestionTitle>
          {canEdit && (
            <QuestionActions>
              <Button variant="danger" size="sm" onClick={handleDeleteQuestion}>
                삭제
              </Button>
            </QuestionActions>
          )}
        </QuestionHeader>
        <QuestionContent>{question.questionContent}</QuestionContent>
        <QuestionMeta>
          <span>작성자: 사용자 {question.userId}</span>
          <span>상태: {question.isAnswered ? '답변완료' : '답변대기'}</span>
        </QuestionMeta>
      </QuestionCard>

      <AnswersSection>
        <SectionTitle>답변 {answers.length}개</SectionTitle>

        {answers.length === 0 ? (
          <EmptyState
            icon="💬"
            title="아직 답변이 없습니다"
            description="트레이너의 답변을 기다려주세요."
          />
        ) : (
          answers.map((answer) => (
            <AnswerCard key={answer.answerId}>
              <AnswerHeader>
                <AnswerAuthor>
                  <span>트레이너 {answer.userId}</span>
                  <TrainerBadge>트레이너</TrainerBadge>
                </AnswerAuthor>
                {answer.userId === user?.userId && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteAnswer(answer.answerId)}
                  >
                    삭제
                  </Button>
                )}
              </AnswerHeader>
              <AnswerContent>{answer.answerContent}</AnswerContent>
            </AnswerCard>
          ))
        )}

        {isTrainer && (
          <AnswerForm>
            <FormTitle>답변 작성</FormTitle>
            <Input
              multiline
              placeholder="답변을 작성해주세요"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
            />
            <FormActions>
              <Button onClick={handleSubmitAnswer}>답변 등록</Button>
            </FormActions>
          </AnswerForm>
        )}
      </AnswersSection>
    </PageWrapper>
  )
}

export default QuestionDetailPage
