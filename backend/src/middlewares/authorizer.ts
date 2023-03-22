import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import middy from "@middy/core";
import { createError } from "@middy/util";

export type ContextWithToken = Context & { accessToken: string };

export const authorizerMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  any,
  ContextWithToken
> => {
  return {
    before: async (handler) => {
      const authorizationHeader = handler.event.headers?.["Authorization"];

      if (!authorizationHeader && !authorizationHeader.includes("Bearer ")) {
        const error = createError(401, "Unauthorized");
        throw error;
      }

      const accessToken = authorizationHeader.replace("Bearer ", "");
      const decodedAccessToken = Buffer.from(accessToken, "base64").toString();

      handler.context["accessToken"] = decodedAccessToken;
    },
  };
};
