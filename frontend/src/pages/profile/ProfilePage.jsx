import { useState } from 'react'
import styled from 'styled-components'
import useAuthStore from '../../store/authStore'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

const ProfileInfo = styled.div`
  flex: 1;
`

const UserName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const UserRole = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`

const DangerZone = styled.div`
  background-color: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`

const DangerTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const DangerText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ModalContent = styled.div`
  text-align: center;
`

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ModalWarning = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`

const ProfilePage = () => {
  const { user, logout } = useAuthStore()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const getRoleText = (role) => {
    switch (role) {
      case 'TRAINER': return '트레이너'
      case 'ADMIN': return '관리자'
      default: return '일반 회원'
    }
  }

  const handleDeleteAccount = () => {
    // 실제로는 API 호출 필요
    logout()
    setShowDeleteModal(false)
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>마이페이지</PageTitle>
      </PageHeader>

      <ProfileCard>
        <ProfileHeader>
          <Avatar>
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <ProfileInfo>
            <UserName>{user?.username || '사용자'}</UserName>
            <UserRole>{getRoleText(user?.role)}</UserRole>
          </ProfileInfo>
        </ProfileHeader>

        <InfoSection>
          <SectionTitle>계정 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>아이디</InfoLabel>
              <InfoValue>{user?.username || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>회원 유형</InfoLabel>
              <InfoValue>{getRoleText(user?.role)}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoSection>
      </ProfileCard>

      <DangerZone>
        <DangerTitle>⚠️ 위험 구역</DangerTitle>
        <DangerText>
          회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </DangerText>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          회원 탈퇴
        </Button>
      </DangerZone>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="회원 탈퇴"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              탈퇴하기
            </Button>
          </>
        }
      >
        <ModalContent>
          <ModalText>정말로 탈퇴하시겠습니까?</ModalText>
          <ModalWarning>
            탈퇴 시 모든 데이터가 즉시 삭제되며 복구할 수 없습니다.
          </ModalWarning>
        </ModalContent>
      </Modal>
    </PageWrapper>
  )
}

export default ProfilePage
