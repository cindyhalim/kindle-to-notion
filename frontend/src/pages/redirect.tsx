import React, { useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "rebass";
import { Loading } from "../components/loading";
import { ACCESS_TOKEN_KEY } from "../core/auth/constants";
import { authenticate } from "../core/react-query";
import { RoutesEnum } from "../core/router/routes";
import { theme } from "../layout/theme";

export const AuthRedirect = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  const { mutateAsync, isError } = useMutation("authenticate", authenticate);

  const showError = error || isError || !code;

  const getAccessToken = useCallback(
    async (code: string) => {
      const response = await mutateAsync({ code });

      if (response.accessToken) {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        navigate(RoutesEnum.HOME);
      }
    },
    [mutateAsync, navigate]
  );

  useEffect(() => {
    if (!error && code) {
      getAccessToken(code);
    }
  }, [code, error, getAccessToken]);

  if (showError) {
    return (
      <Flex
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Text sx={{ ...theme.title }}>something went wrong :(</Text>
      </Flex>
    );
  }

  return (
    <Flex
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Loading isDark width={150} height={150} />
    </Flex>
  );
};
