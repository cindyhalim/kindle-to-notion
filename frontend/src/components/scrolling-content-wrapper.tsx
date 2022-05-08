import React from "react";
import { Box } from "rebass";

export const ScrollingContentWrapper: React.FC = ({ children }) => (
  <Box
    sx={{
      maxHeight: "450px",
      overflowY: "auto",
      padding: 20,
      width: "100%",
    }}
  >
    {children}
  </Box>
);
