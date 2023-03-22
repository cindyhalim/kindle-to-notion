import axios, { AxiosResponse } from "axios";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { config } from "src/environment";
import {
  makeResultResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import schema from "./schema";

interface INotionAuthBody {
  grant_type: "authorization_code";
  code: string;
  redirect_uri: string;
}

interface INotionAuthResponse {
  access_token: string;
  workspace_id: string;
  workspace_name?: string;
  workspace_icon?: string;
  bot_id: string;
  owner?: unknown;
  error?: any;
}

const NOTION_AUTH_URL = "https://api.notion.com/v1/oauth/token";

function getRedirectUri(mode: string) {
  switch (mode) {
    case "extension":
      return `${config.clientUrl}/auth/success`;
    default:
      return `${config.clientUrl}/redirect`;
  }
}

function getNotionCredentials(mode: string) {
  switch (mode) {
    case "extension":
      return {
        clientId: config.readsExtension.notionClientId,
        clientSecret: config.readsExtension.notionClientSecret,
      };
    default:
      return {
        clientId: config.notionClientId,
        clientSecret: config.notionClientSecret,
      };
  }
}

const authenticate: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { code } = event.body;
    const { mode } = event.queryStringParameters;
    const { clientId, clientSecret } = getNotionCredentials(mode);

    const encodedCredentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    let body: INotionAuthBody = {
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(mode),
    };

    const response: AxiosResponse<INotionAuthResponse> = await axios.post(
      NOTION_AUTH_URL,
      body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    );

    if (response?.data?.error) {
      throw new Error("Error requesting token");
    }

    return makeResultResponse({
      accessToken: response.data.access_token,
      workspaceName: response.data.workspace_name || null,
      workspaceIcon: response.data.workspace_icon || null,
    });
  } catch (e) {
    throw new Error("Error authenticating");
  }
};

export const main = middy(authenticate).use(jsonBodyParser());
