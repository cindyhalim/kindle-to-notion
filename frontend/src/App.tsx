import React from "react";
import { Home } from "./pages/home";

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TermsAndConditions } from "./pages/terms-and-conditions";
import { PrivacyPolicy } from "./pages/privacy-policy";
import { AuthRedirect } from "./pages/redirect";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="how-to" element={<></>} />
          <Route path="redirect" element={<AuthRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
