import React from "react";
import { Box, Flex, Text } from "rebass";
import { theme } from "./theme";

export const BaseLayout: React.FC<{ title: string }> = ({
  children,
  title,
}) => (
  <Box
    sx={{
      height: "100vh",
      width: "100%",
      backgroundColor: theme.colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Flex flexDirection={"column"}>
      <Text
        sx={{ ...theme.title, color: theme.colors.black, marginBottom: 40 }}
      >
        {title}
      </Text>
      {children}
    </Flex>
  </Box>
);
