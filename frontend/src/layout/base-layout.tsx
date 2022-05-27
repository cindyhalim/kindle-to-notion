import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "rebass";
import { Button, IButtonProps } from "../components/button";
import { AnimatedLink } from "../components/animated-link";
import { Loading } from "../components/loading";
import { RoutesEnum } from "../core/router/routes";
import { theme } from "./theme";

export const BaseLayout: React.FC<{
  title: string;
  buttons: IButtonProps[];
  queryProps?: {
    isLoading: boolean;
    hasError?: boolean;
    refetch?: () => void;
    isEmpty?: boolean;
  };
}> = ({ children, title, buttons, queryProps }) => {
  const navigate = useNavigate();
  const getButtons = () => {
    if (queryProps?.isLoading) {
      return null;
    }

    if (queryProps?.hasError || queryProps?.isEmpty) {
      return (
        <Button
          disabled={queryProps?.isLoading}
          onClick={() => queryProps?.refetch && queryProps.refetch()}
        >
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
    if (queryProps?.isLoading) {
      return <Loading width={150} height={150} isDark />;
    }

    if (queryProps?.hasError) {
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
      <AnimatedLink
        sx={{ marginBottom: [30, 30, 40] }}
        onClick={() => navigate(RoutesEnum.HOME)}
        textColor={theme.colors.black}
      >
        {"< home"}
      </AnimatedLink>
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
          justifyContent: "center",
        }}
      >
        {getButtons()}
      </Flex>
    </Box>
  );
};
