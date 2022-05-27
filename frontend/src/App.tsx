import React from "react";
import { Home } from "./pages/home";

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TermsAndConditions } from "./pages/terms-and-conditions";
import { PrivacyPolicy } from "./pages/privacy-policy";
import { AuthRedirect } from "./pages/redirect";
import { ProtectedRoute } from "./core/router/components/protected-route";
import { GetBooksInfo } from "./pages/prettify";
import { EPubToKindle } from "./pages/epub-to-kindle";
import { UploadClippingsToNotion } from "./pages/clippings-to-notion";
import { getAuth } from "./core/auth/utils";
import { RoutesEnum } from "./core/router/routes";
import { Menu } from "./pages/menu";
import { HowTo } from "./pages/how-to";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const { isAuthenticated } = getAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={RoutesEnum.HOME} element={<Home />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path={RoutesEnum.PRETTIFY} element={<GetBooksInfo />} />
            <Route
              path={RoutesEnum.EPUB_TO_KINDLE}
              element={<EPubToKindle />}
            />
            <Route
              path={RoutesEnum.CLIPPINGS_TO_NOTION}
              element={<UploadClippingsToNotion />}
            />
          </Route>
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/how-to" element={<HowTo />} />
          <Route path="/redirect" element={<AuthRedirect />} />
        </Routes>
        <Menu />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
