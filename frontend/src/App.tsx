import React from "react";
import { Home } from "./pages/home";

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TermsAndConditions } from "./pages/terms-and-conditions";
import { PrivacyPolicy } from "./pages/privacy-policy";
import { AuthRedirect } from "./pages/redirect";
import { ProtectedRoute } from "./core/router/components/protected-route";
import { useAuth } from "./core/auth/hooks";
import { GetBooksInfo } from "./pages/book-scraper/get-books-info";
import { EPubToKindle } from "./pages/epub-to-kindle";
import { UploadClippingsToNotion } from "./pages/clippings-to-notion";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="prettify" element={<GetBooksInfo />} />
            <Route path="epub-to-kindle" element={<EPubToKindle />} />
            <Route
              path="clippings-to-notion"
              element={<UploadClippingsToNotion />}
            />
          </Route>
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="how-to" element={<></>} />
          <Route path="redirect" element={<AuthRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
