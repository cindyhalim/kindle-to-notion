import axios, { AxiosResponse } from "axios";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { config } from "src/environment";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";

interface IAuthenticateEventBody {
  code: string;
}

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

const controller = async (
  event: ValidatedAPIGatewayProxyEvent<IAuthenticateEventBody>
) => {
  if (!event.body) {
    throw new Error("Missing body");
  }
  try {
    const { code } = event.body;

    const credential = Buffer.from(
      `${config.notionClientId}:${config.notionClientSecret}`
    ).toString("base64");

    const body: INotionAuthBody = {
      grant_type: "authorization_code",
      code,
      redirect_uri: `${config.clientUrl}/redirect`,
    };
    const response: AxiosResponse<INotionAuthResponse> = await axios.post(
      NOTION_AUTH_URL,
      body,
      {
        headers: {
          Authorization: `Basic ${credential}`,
        },
      }
    );

    if (response?.data?.error) {
      throw new Error("Error requesting token");
    }

    return makeResultResponse({ accessToken: response.data.access_token });
  } catch (e) {
    throw new Error("Error authenticating");
  }
};

export const handler = middy(controller).use(jsonBodyParser());
