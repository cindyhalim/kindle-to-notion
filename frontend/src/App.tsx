import React from 'react'
import { Home } from './pages/home'

import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TermsAndConditions } from './pages/terms-and-conditions'
import { PrivacyPolicy } from './pages/privacy-policy'
import { AuthRedirect, SuccessRedirect } from './pages/redirect'
import { ProtectedRoute } from './core/router/components/protected-route'
import { EPubToKindle } from './pages/epub-to-kindle'
import { UploadClippingsToNotion } from './pages/clippings-to-notion'
import { RoutesEnum } from './core/router/routes'
import { Menu } from './pages/menu'
import { HowTo } from './pages/how-to'

const queryClient = new QueryClient()

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path={RoutesEnum.EPUB_TO_KINDLE}
              element={<EPubToKindle />}
            />
            <Route
              path={RoutesEnum.CLIPPINGS_TO_NOTION}
              element={<UploadClippingsToNotion />}
            />
          </Route>
          <Route path={RoutesEnum.TERMS} element={<TermsAndConditions />} />
          <Route path={RoutesEnum.PRIVACY} element={<PrivacyPolicy />} />
          <Route path={RoutesEnum.HOW_TO} element={<HowTo />} />
          <Route path="/redirect" element={<AuthRedirect />} />
          <Route path="/auth/success" element={<SuccessRedirect />} />
          <Route path={RoutesEnum.HOME} element={<Home />} />
        </Routes>
        <Menu />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
