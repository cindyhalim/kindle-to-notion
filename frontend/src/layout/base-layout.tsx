import React from "react";
import { Box, Flex, Text } from "rebass";
import { Button, IButtonProps } from "../components/button";
import { Loading } from "../components/loading";
import { theme } from "./theme";

export const BaseLayout: React.FC<{
  title: string;
  buttons: IButtonProps[];
  isLoading: boolean;
  hasError: boolean;
  isEmpty?: boolean;
  refetch: () => void;
}> = ({ children, title, buttons, isLoading, hasError, refetch, isEmpty }) => {
  const getButtons = () => {
    if (isLoading) {
      return null;
    }

    if (hasError || isEmpty) {
      return (
        <Button disabled={isLoading} onClick={() => refetch()}>
          try again
        </Button>
      );
    }

    return buttons.map((buttonProps, idx) => (
      <Button
        key={idx}
        {...buttonProps}
        sx={{ ...buttonProps.sx, marginLeft: idx > 0 ? 10 : undefined }}
      />
    ));
  };

  const getContent = () => {
    if (isLoading) {
      return <Loading width={150} height={150} isDark />;
    }

    if (hasError) {
      return <Text sx={{ fontSize: 18 }}>something went wrong :(</Text>;
    }

    return children;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: theme.colors.white,
        padding: 20,
      }}
    >
      <Text sx={{ ...theme.title, color: theme.colors.black }}>{title}</Text>
      <Flex
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "450px",
          width: ["100%", "100%", "600px"],
          marginY: 20,
        }}
      >
        {getContent()}
      </Flex>
      <Flex
        sx={{
          width: ["100%", "100%", "600px"],
          justifyContent: ["center", "center", "space-between"],
        }}
      >
        {getButtons()}
      </Flex>
    </Box>
  );
};
