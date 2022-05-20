import React from "react";
import { useAuth } from "../core/auth/hooks";
import { getNotionAuthorizationUrl } from "../core/auth/utils";
import { BaseLayout } from "../layout/base-layout";

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const notionAuthorizeUrl = getNotionAuthorizationUrl();

  return !isAuthenticated ? (
    <BaseLayout title="notion <> kindle" buttons={[]}>
      <a href={notionAuthorizeUrl}>connect notion</a>
    </BaseLayout>
  ) : (
    <>AUTHENTICATED!</>
  );
};
