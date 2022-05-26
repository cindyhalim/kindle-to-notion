import { ValidatedAPIGatewayProxyEvent } from "@libs/apiGateway";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyResult } from "aws-lambda";

export const authorizerMiddleware = <B>(): middy.MiddlewareObject<
  ValidatedAPIGatewayProxyEvent<B>,
  APIGatewayProxyResult
> => {
  return {
    before: async (
      handler: middy.HandlerLambda<
        ValidatedAPIGatewayProxyEvent<B>,
        APIGatewayProxyResult
      >
    ): Promise<void> => {
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
