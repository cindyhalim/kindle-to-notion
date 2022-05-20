import React from "react";
import { config } from "../environment";
import { BaseLayout } from "../layout/base-layout";

const NOTION_AUTHORIZATION_BASE_URL =
  "https://api.notion.com/v1/oauth/authorize";

export const Home = () => {
  const urlParams = new URLSearchParams({
    client_id: config.notionClientId,
    redirect_uri: "https://google.com",
    response_type: "code",
    owner: "user",
  });

  const notionAuthorizeUrl = `${NOTION_AUTHORIZATION_BASE_URL}?${urlParams.toString()}`;

  return (
    <BaseLayout title="welcome to notion <-> kindle" buttons={[]}>
      <a href={notionAuthorizeUrl}>connect notion</a>
    </BaseLayout>
  );
};
