import React from "react";
import { Home } from "./pages/home";

import { BaseLayout } from "./layout/base-layout";

import { UploadClippingsToNotion } from "./pages/upload-clippings";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};
