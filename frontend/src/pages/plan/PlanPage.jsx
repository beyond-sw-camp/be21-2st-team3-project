import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { planApi } from '../../api/plan.api'
import Calendar from '../../components/calendar/Calendar'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

const PageWrapper = styled.div`
  max-width: 1200px;
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

const PlanList = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const PlanListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const PlanListTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const PlanCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, $isCompleted }) =>
    $isCompleted ? '#F0FDF4' : theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-left: 4px solid
    ${({ theme, $isCompleted }) => ($isCompleted ? '#22C55E' : 'transparent')};

  &:last-child {
    margin-bottom: 0;
  }
`

const PlanInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const PlanDetails = styled.div`
  flex: 1;
`

const PlanType = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const PlanMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const PlanActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

const Badge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case 'cardio':
        return '#DBEAFE'
      case 'strength':
        return '#FEE2E2'
      case 'completed':
        return '#DCFCE7'
      default:
        return theme.colors.background
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'cardio':
        return '#1D4ED8'
      case 'strength':
        return '#DC2626'
      case 'completed':
        return '#16A34A'
      default:
        return theme.colors.text
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const EXERCISE_TYPES = [
  { value: 'running', label: '달리기' },
  { value: 'cycling', label: '자전거' },
  { value: 'swimming', label: '수영' },
  { value: 'weight', label: '웨이트' },
  { value: 'yoga', label: '요가' },
  { value: 'pilates', label: '필라테스' },
]

const EXERCISE_CATEGORIES = [
  { value: 'cardio', label: '유산소' },
  { value: 'strength', label: '무산소' },
]

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: '쉬움' },
  { value: 'medium', label: '보통' },
  { value: 'hard', label: '어려움' },
]

const BODY_PARTS = [
  { value: 'upper', label: '상체' },
  { value: 'lower', label: '하체' },
  { value: 'core', label: '코어' },
  { value: 'full', label: '전신' },
]

// 영어 값을 한글로 변환하는 헬퍼 함수
const getExerciseTypeLabel = (value) => {
  const found = EXERCISE_TYPES.find((t) => t.value === value)
  return found ? found.label : value
}

const getCategoryLabel = (value) => {
  const found = EXERCISE_CATEGORIES.find((c) => c.value === value)
  return found ? found.label : value
}

const getDifficultyLabel = (value) => {
  const found = DIFFICULTY_LEVELS.find((d) => d.value === value)
  return found ? found.label : value
}

const getBodyPartLabel = (value) => {
  const found = BODY_PARTS.find((b) => b.value === value)
  return found ? found.label : value
}

const PlanPage = () => {
  const [plans, setPlans] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [formData, setFormData] = useState({
    exerciseType: '',
    category: 'cardio',
    difficulty: 'medium',
    bodyPart: 'full',
    workoutRecord: 30,
    burnedCalories: 0,
  })

  const fetchPlans = async () => {
    setIsLoading(true)
    try {
      // 오늘 날짜 기준으로 계획 조회
      const today = new Date().toISOString().split('T')[0]
      const response = await planApi.getPlansByDate(today)
      const plansData = Array.isArray(response) ? response : (response ? [response] : [])
      setPlans(plansData)
    } catch (error) {
      console.error('계획 로딩 실패:', error)
      setPlans([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    
    if (date) {
      setIsLoading(true)
      try {
        const response = await planApi.getPlansByDate(date)
        // 응답이 배열로 오는 경우와 단일 객체로 오는 경우 모두 처리
        const plansData = Array.isArray(response) ? response : (response.data ? [response.data] : [response])
        setPlans(plansData)
      } catch (error) {
        console.error('날짜별 계획 조회 실패:', error)
        setPlans([])
      } finally {
        setIsLoading(false)
      }
    } else {
      // 날짜 선택 해제시 전체 계획 다시 불러오기
      fetchPlans()
    }
  }

  const handleCreatePlan = () => {
    if (!selectedDate) {
      alert('날짜를 먼저 선택해주세요.')
      return
    }
    setEditingPlan(null)
    setFormData({
      exerciseType: '',
      category: 'cardio',
      difficulty: 'medium',
      bodyPart: 'full',
      workoutRecord: 30,
      burnedCalories: 0,
    })
    setShowModal(true)
  }

  const handleEditPlan = (plan) => {
    setEditingPlan(plan)
    setFormData({
      exerciseType: plan.exerciseType,
      category: plan.category,
      difficulty: plan.difficulty,
      bodyPart: plan.bodyPart,
      workoutRecord: plan.workoutRecord || 30,
      burnedCalories: plan.burnedCalories || 0,
    })
    setShowModal(true)
  }

  const handleDeletePlan = async (plan) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      const dateToDelete = plan.date || selectedDate
      await planApi.deletePlanByDate(dateToDelete)
      if (selectedDate) {
        handleDateSelect(selectedDate)
      } else {
        fetchPlans()
      }
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  // 운동 완료 처리
  const handleCompletePlan = async (plan) => {
    try {
      const dateToComplete = plan.date || selectedDate
      await planApi.completeWorkout(dateToComplete)
      if (selectedDate) {
        handleDateSelect(selectedDate)
      } else {
        fetchPlans()
      }
    } catch (error) {
      console.error('완료 처리 실패:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.exerciseType) {
      alert('운동 종류를 선택해주세요.')
      return
    }

    try {
      // 요일 계산
      const dayNames = ['일', '월', '화', '수', '목', '금', '토']
      const dayOfWeek = dayNames[new Date(selectedDate).getDay()]

      const planData = {
        dayOfWeek,
        exerciseType: formData.exerciseType,
        category: formData.category,
        difficulty: formData.difficulty,
        bodyPart: formData.bodyPart,
        date: selectedDate,
        workoutRecord: formData.workoutRecord,
        burnedCalories: formData.burnedCalories,
        isCompleted: editingPlan?.isCompleted || false,
      }

      if (editingPlan) {
        await planApi.updatePlanByDate(selectedDate, planData)
      } else {
        await planApi.createPlan(planData)
      }
      setShowModal(false)
      if (selectedDate) {
        handleDateSelect(selectedDate)
      } else {
        fetchPlans()
      }
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  const filteredPlans = selectedDate
    ? plans.filter(plan => plan.date === selectedDate)
    : plans

  const calendarEvents = plans.map(plan => ({ date: plan.date }))

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>운동 계획</PageTitle>
        <Button onClick={handleCreatePlan}>계획 추가</Button>
      </PageHeader>

      <ContentGrid>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          events={calendarEvents}
        />

        <PlanList>
          <PlanListHeader>
            <PlanListTitle>
              {selectedDate ? `${selectedDate} 계획` : '전체 계획'}
            </PlanListTitle>
            {selectedDate && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                전체 보기
              </Button>
            )}
          </PlanListHeader>

          {isLoading ? (
            <LoadingSpinner text="계획 로딩 중..." />
          ) : filteredPlans.length === 0 ? (
            <EmptyState
              icon="📅"
              title="계획이 없습니다"
              description={selectedDate ? '이 날짜에 등록된 계획이 없습니다.' : '운동 계획을 등록해보세요!'}
            />
          ) : (
            filteredPlans.map((plan) => (
              <PlanCard key={plan.workoutPlanId} $isCompleted={plan.isCompleted || plan.completed}>
                <PlanInfo>
                  <PlanDetails>
                    <PlanType>{getExerciseTypeLabel(plan.exerciseType)}</PlanType>
                    <PlanMeta>
                      {(plan.isCompleted || plan.completed) && <Badge $type="completed">✓ 완료</Badge>}
                      <Badge
                        $type={plan.category === 'cardio' || plan.category === '유산소' ? 'cardio' : 'strength'}
                      >
                        {getCategoryLabel(plan.category)}
                      </Badge>
                      <span>{getDifficultyLabel(plan.difficulty)}</span>
                      <span>{getBodyPartLabel(plan.bodyPart)}</span>
                      <span>{plan.workoutRecord || 0}분</span>
                      {plan.burnedCalories > 0 && <span>{plan.burnedCalories}kcal</span>}
                    </PlanMeta>
                  </PlanDetails>
                  <PlanActions>
                    {!(plan.isCompleted || plan.completed) && (
                      <Button variant="ghost" size="sm" onClick={() => handleCompletePlan(plan)}>
                        완료
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan)}>
                      삭제
                    </Button>
                  </PlanActions>
                </PlanInfo>
              </PlanCard>
            ))
          )}
        </PlanList>
      </ContentGrid>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? '계획 수정' : '새 계획 추가'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button onClick={handleSubmit}>저장</Button>
          </>
        }
      >
        <FormGroup>
          <FormLabel>운동 종류</FormLabel>
          <Select
            value={formData.exerciseType}
            onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
          >
            <option value="">선택하세요</option>
            {EXERCISE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <FormLabel>운동 유형</FormLabel>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {EXERCISE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <FormLabel>난이도</FormLabel>
          <Select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <FormLabel>운동 부위</FormLabel>
          <Select
            value={formData.bodyPart}
            onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
          >
            {BODY_PARTS.map((part) => (
              <option key={part.value} value={part.value}>{part.label}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Input
            label="운동 시간 (분)"
            type="number"
            value={formData.workoutRecord}
            onChange={(e) => setFormData({ ...formData, workoutRecord: parseInt(e.target.value) || 0 })}
            min="1"
          />
        </FormGroup>

        <FormGroup>
          <Input
            label="소모 칼로리 (kcal)"
            type="number"
            value={formData.burnedCalories}
            onChange={(e) => setFormData({ ...formData, burnedCalories: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </FormGroup>
      </Modal>
    </PageWrapper>
  )
}

export default PlanPage
