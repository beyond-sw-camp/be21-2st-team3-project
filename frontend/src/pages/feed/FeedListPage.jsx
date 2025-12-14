import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { feedApi } from '../../api/feed.api'
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

const SearchSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: ${({ theme }) => theme.colors.surface};
`

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const FeedCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FeedAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const AuthorName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`

const FeedActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ActionButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`

const FeedTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const FeedContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`

const FeedImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ImageUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xl};
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

const FeedListPage = () => {
  const { user } = useAuthStore()
  const [feeds, setFeeds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchType, setSearchType] = useState('title')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingFeed, setEditingFeed] = useState(null)
  const [formData, setFormData] = useState({ feedTitle: '', feedContent: '' })
  const [selectedImage, setSelectedImage] = useState(null)

  const fetchFeeds = async () => {
    setIsLoading(true)
    try {
      const response = await feedApi.getMyFeeds()
      setFeeds(response.data || [])
    } catch (error) {
      console.error('피드 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchFeeds()
      return
    }

    setIsLoading(true)
    try {
      let response
      if (searchType === 'title') {
        response = await feedApi.searchByTitle(searchQuery)
      } else {
        response = await feedApi.searchByContent(searchQuery)
      }
      setFeeds(response.data || [])
    } catch (error) {
      console.error('검색 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFeed = () => {
    setEditingFeed(null)
    setFormData({ feedTitle: '', feedContent: '' })
    setSelectedImage(null)
    setShowModal(true)
  }

  const handleEditFeed = (feed) => {
    setEditingFeed(feed)
    setFormData({ feedTitle: feed.feedTitle, feedContent: feed.feedContent })
    setSelectedImage(null)
    setShowModal(true)
  }

  const handleDeleteFeed = async (feedId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      await feedApi.deleteFeed(feedId)
      fetchFeeds()
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingFeed) {
        await feedApi.updateFeed(editingFeed.feedId, formData.feedTitle, formData.feedContent, selectedImage)
      } else {
        await feedApi.createFeed(formData.feedTitle, formData.feedContent, selectedImage)
      }
      setShowModal(false)
      fetchFeeds()
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>소셜 피드</PageTitle>
        <Button onClick={handleCreateFeed}>글쓰기</Button>
      </PageHeader>

      <SearchBar>
        <SearchSelect value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </SearchSelect>
        <SearchInput
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
      </SearchBar>

      {isLoading ? (
        <LoadingSpinner text="피드 로딩 중..." />
      ) : feeds.length === 0 ? (
        <EmptyState
          icon="📝"
          title="피드가 없습니다"
          description="첫 번째 피드를 작성해보세요!"
        />
      ) : (
        <FeedList>
          {feeds.map((feed) => (
            <FeedCard key={feed.feedId}>
              <FeedHeader>
                <FeedAuthor>
                  <AuthorAvatar>U</AuthorAvatar>
                  <AuthorName>사용자 {feed.userId}</AuthorName>
                </FeedAuthor>
                {feed.userId === user?.userId && (
                  <FeedActions>
                    <ActionButton onClick={() => handleEditFeed(feed)}>수정</ActionButton>
                    <ActionButton onClick={() => handleDeleteFeed(feed.feedId)}>삭제</ActionButton>
                  </FeedActions>
                )}
              </FeedHeader>
              <FeedTitle>{feed.feedTitle}</FeedTitle>
              <FeedContent>{feed.feedContent}</FeedContent>
              {feed.imageUrl && <FeedImage src={feed.imageUrl} alt={feed.feedTitle} />}
            </FeedCard>
          ))}
        </FeedList>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingFeed ? '피드 수정' : '새 피드 작성'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button onClick={handleSubmit}>저장</Button>
          </>
        }
      >
        <FormGroup>
          <Input
            label="제목"
            value={formData.feedTitle}
            onChange={(e) => setFormData({ ...formData, feedTitle: e.target.value })}
            placeholder="제목을 입력하세요"
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="내용"
            multiline
            value={formData.feedContent}
            onChange={(e) => setFormData({ ...formData, feedContent: e.target.value })}
            placeholder="내용을 입력하세요"
          />
        </FormGroup>
        <FormGroup>
          <label>이미지</label>
          <ImageUpload onClick={() => document.getElementById('imageInput').click()}>
            {selectedImage ? selectedImage.name : '클릭하여 이미지 선택'}
          </ImageUpload>
          <HiddenInput
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </FormGroup>
      </Modal>
    </PageWrapper>
  )
}

export default FeedListPage
