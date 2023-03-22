import type { APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import { createError } from "@middy/util";
import type { ValidatedAPIGatewayProxyEvent } from "@libs/apiGateway";

type Context = { accessToken: string };

export const authorizerMiddleware = <B>(): middy.MiddlewareObj<
  ValidatedAPIGatewayProxyEvent<B>,
  APIGatewayProxyResult
> => {
  return {
    before: async (handler): Promise<void> => {
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
