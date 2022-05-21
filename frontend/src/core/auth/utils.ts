import { config } from "../../environment";
import { NOTION_AUTHORIZATION_BASE_URL } from "./constants";

export const getNotionAuthorizationUrl = () => {
  const urlParams = new URLSearchParams({
    client_id: config.notionClientId,
    redirect_uri: "https://notion-kindle.netlify.app/redirect",
    response_type: "code",
    owner: "user",
  });

  const notionAuthorizeUrl = `${NOTION_AUTHORIZATION_BASE_URL}?${urlParams.toString()}`;
  return notionAuthorizeUrl;
};

export const getAuth = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  return { isAuthenticated: Boolean(accessToken), accessToken };
};
