import React from "react";
import { Flex, Text } from "rebass";
import { theme } from "../../layout/theme";

export const SuccessRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  const showError = error || !code;

  return (
    <Flex
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Text sx={{ ...theme.title }}>
        {showError ? "something went wrong :(" : "success!"}
      </Text>
    </Flex>
  );
};
