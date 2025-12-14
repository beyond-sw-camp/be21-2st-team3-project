import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`

const ContentArea = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

const Layout = () => {
  return (
    <LayoutWrapper>
      <Sidebar />
      <MainContent>
        <Navbar />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutWrapper>
  )
}

export default Layout
