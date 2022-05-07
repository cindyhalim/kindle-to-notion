import React from "react";

const NOTION_AUTHORIZATION_BASE_URL =
  "https://api.notion.com/v1/oauth/authorize";
export const Home: React.FC = () => {
  const urlParams = new URLSearchParams({
    client_id: "d361db8d-fad1-4c72-8cdb-80caa2dd1407",
    redirect_uri: "https://google.com",
    response_type: "code",
    owner: "user",
  });

  const notionAuthorizeUrl = `${NOTION_AUTHORIZATION_BASE_URL}?${urlParams.toString()}`;

  return <a href={notionAuthorizeUrl}>Add Notion</a>;
};
