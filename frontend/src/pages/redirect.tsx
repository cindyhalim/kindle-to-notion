import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { authenticate } from "../core/react-query";

export const AuthRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  const { mutateAsync, isError } = useMutation("authenticate", authenticate);

  const showError = error || isError || !code;

  const getAccessToken = async (code: string) => {
    const response = await mutateAsync({ code });

    console.log("hii access token", response.accessToken);

    // store this somewhere
    // navigate to main app on success

    return response.accessToken;
  };

  useEffect(() => {
    if (!error && code) {
      getAccessToken(code);
    }
  }, []);

  if (showError) {
    return <>ERROR!</>;
  }

  return <>SUCCESS</>;
};
