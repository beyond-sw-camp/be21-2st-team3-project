import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { dietApi } from '../../api/diet.api'
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

const DietList = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const DietListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const DietListTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const MealSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`

const MealTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const DietCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`

const DietImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
`

const DietImagePlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`

const DietInfo = styled.div`
  flex: 1;
`

const DietName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const DietCalories = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const DietActions = styled.div`
  display: flex;
  flex-direction: column;
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

const ImageUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`

const HiddenInput = styled.input`
  display: none;
`

const TotalCalories = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const TotalLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const TotalValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`

const MEAL_TIMES = [
  { value: 'breakfast', label: '아침', icon: '🌅' },
  { value: 'lunch', label: '점심', icon: '☀️' },
  { value: 'dinner', label: '저녁', icon: '🌙' },
  { value: 'snack', label: '간식', icon: '🍪' },
]

const DietPage = () => {
  const [diets, setDiets] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDiet, setEditingDiet] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({
    foodName: '',
    mealTime: 'breakfast',
    calories: 0,
    foodId: 1,
  })

  const fetchDiets = async (date) => {
    setIsLoading(true)
    try {
      const targetDate = date || new Date().toISOString().split('T')[0]
      const response = await dietApi.getDietPlanByDate(targetDate)
      const dietsData = Array.isArray(response) ? response : (response?.data || (response ? [response] : []))
      setDiets(dietsData)
    } catch (error) {
      console.error('식단 로딩 실패:', error)
      setDiets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
    fetchDiets(today)
  }, [])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    if (date) {
      fetchDiets(date)
    }
  }

  const handleCreateDiet = () => {
    if (!selectedDate) {
      alert('날짜를 먼저 선택해주세요.')
      return
    }
    setEditingDiet(null)
    setFormData({
      foodName: '',
      mealTime: 'breakfast',
      calories: 0,
      foodId: 1,
    })
    setSelectedImage(null)
    setShowModal(true)
  }

  const handleEditDiet = (diet) => {
    setEditingDiet(diet)
    setFormData({
      foodName: diet.foodName,
      mealTime: diet.mealTime,
      calories: diet.calories,
      foodId: diet.foodId || 1,
    })
    setSelectedImage(null)
    setShowModal(true)
  }

  const handleDeleteDiet = async (dietPlanId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      await dietApi.deleteDietPlan(dietPlanId)
      fetchDiets(selectedDate)
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!formData.foodName) {
      alert('음식 이름을 입력해주세요.')
      return
    }

    try {
      const dietPlanData = {
        foodName: formData.foodName,
        mealTime: formData.mealTime,
        calories: formData.calories,
        foodId: formData.foodId || 1,
        date: selectedDate,
      }

      if (editingDiet) {
        await dietApi.updateDietPlan(editingDiet.dietPlanId, dietPlanData, selectedImage)
      } else {
        await dietApi.createDietPlan(dietPlanData, selectedImage)
      }
      setShowModal(false)
      fetchDiets(selectedDate)
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  // 백엔드에서 이미 날짜별로 필터링된 데이터를 반환하므로 추가 필터링 불필요
  const filteredDiets = diets

  const groupedDiets = MEAL_TIMES.reduce((acc, meal) => {
    acc[meal.value] = filteredDiets.filter((diet) => diet.mealTime === meal.value)
    return acc
  }, {})

  const totalCalories = filteredDiets.reduce((sum, diet) => sum + (diet.calories || 0), 0)

  // 캘린더 이벤트는 선택된 날짜 기준으로 표시
  const calendarEvents = selectedDate ? [{ date: selectedDate }] : []

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>식단 관리</PageTitle>
        <Button onClick={handleCreateDiet}>식단 추가</Button>
      </PageHeader>

      <ContentGrid>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          events={calendarEvents}
        />

        <DietList>
          <DietListHeader>
            <DietListTitle>
              {selectedDate ? `${selectedDate} 식단` : '전체 식단'}
            </DietListTitle>
            {selectedDate && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                전체 보기
              </Button>
            )}
          </DietListHeader>

          {isLoading ? (
            <LoadingSpinner text="식단 로딩 중..." />
          ) : filteredDiets.length === 0 ? (
            <EmptyState
              icon="🍽️"
              title="식단이 없습니다"
              description={selectedDate ? '이 날짜에 등록된 식단이 없습니다.' : '식단을 등록해보세요!'}
            />
          ) : (
            <>
              {MEAL_TIMES.map((meal) => (
                groupedDiets[meal.value].length > 0 && (
                  <MealSection key={meal.value}>
                    <MealTitle>
                      {meal.icon} {meal.label}
                    </MealTitle>
                    {groupedDiets[meal.value].map((diet) => (
                      <DietCard key={diet.dietPlanId}>
                        {diet.imageUrl ? (
                          <DietImage src={diet.imageUrl} alt={diet.foodName} />
                        ) : (
                          <DietImagePlaceholder>🍴</DietImagePlaceholder>
                        )}
                        <DietInfo>
                          <DietName>{diet.foodName}</DietName>
                          <DietCalories>{diet.calories} kcal</DietCalories>
                        </DietInfo>
                        <DietActions>
                          <Button variant="ghost" size="sm" onClick={() => handleEditDiet(diet)}>
                            수정
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteDiet(diet.dietPlanId)}>
                            삭제
                          </Button>
                        </DietActions>
                      </DietCard>
                    ))}
                  </MealSection>
                )
              ))}

              <TotalCalories>
                <TotalLabel>총 섭취 칼로리</TotalLabel>
                <TotalValue>{totalCalories} kcal</TotalValue>
              </TotalCalories>
            </>
          )}
        </DietList>
      </ContentGrid>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDiet ? '식단 수정' : '새 식단 추가'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button onClick={handleSubmit}>저장</Button>
          </>
        }
      >
        <FormGroup>
          <Input
            label="음식 이름"
            value={formData.foodName}
            onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
            placeholder="음식 이름을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>식사 시간대</FormLabel>
          <Select
            value={formData.mealTime}
            onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
          >
            {MEAL_TIMES.map((meal) => (
              <option key={meal.value} value={meal.value}>
                {meal.icon} {meal.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Input
            label="칼로리 (kcal)"
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>음식 사진</FormLabel>
          <ImageUpload onClick={() => document.getElementById('dietImageInput').click()}>
            {selectedImage ? selectedImage.name : '클릭하여 이미지 선택'}
          </ImageUpload>
          <HiddenInput
            id="dietImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </FormGroup>
      </Modal>
    </PageWrapper>
  )
}

export default DietPage
