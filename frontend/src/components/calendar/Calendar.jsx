import { useState } from 'react'
import styled from 'styled-components'

const CalendarWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const MonthTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const WeekDay = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm};
`

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`

const DayCell = styled.button`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $isCurrentMonth, $isSelected, $isToday }) => {
    if ($isSelected) return 'white'
    if (!$isCurrentMonth) return theme.colors.textLight
    if ($isToday) return theme.colors.primary
    return theme.colors.text
  }};
  background-color: ${({ theme, $isSelected, $isToday }) => {
    if ($isSelected) return theme.colors.primary
    if ($isToday) return theme.colors.primaryLight
    return 'transparent'
  }};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $isSelected }) => 
      $isSelected ? theme.colors.primaryHover : theme.colors.background};
  }

  &:disabled {
    cursor: default;
  }
`

const EventDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
  margin-top: 2px;
`

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

const Calendar = ({ selectedDate, onDateSelect, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const isSelected = (day) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return (
      day === selected.getDate() &&
      month === selected.getMonth() &&
      year === selected.getFullYear()
    )
  }

  const hasEvent = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.some(event => event.date === dateStr)
  }

  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDateSelect(dateStr)
  }

  const renderDays = () => {
    const days = []
    
    // 이전 달의 날짜들
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <DayCell key={`prev-${i}`} $isCurrentMonth={false} disabled>
          {prevMonthDays - i}
        </DayCell>
      )
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <DayCell
          key={day}
          $isCurrentMonth={true}
          $isToday={isToday(day)}
          $isSelected={isSelected(day)}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {hasEvent(day) && <EventDot />}
        </DayCell>
      )
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <DayCell key={`next-${i}`} $isCurrentMonth={false} disabled>
          {i}
        </DayCell>
      )
    }

    return days
  }

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <NavButton onClick={prevMonth}>◀</NavButton>
        <MonthTitle>{year}년 {MONTHS[month]}</MonthTitle>
        <NavButton onClick={nextMonth}>▶</NavButton>
      </CalendarHeader>

      <WeekDays>
        {WEEK_DAYS.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDays>

      <DaysGrid>{renderDays()}</DaysGrid>
    </CalendarWrapper>
  )
}

export default Calendar
