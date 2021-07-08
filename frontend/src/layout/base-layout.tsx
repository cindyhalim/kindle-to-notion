import React from "react";
import { Box } from "rebass";

export const BaseLayout: React.FC = ({ children }) => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </Box>
);
