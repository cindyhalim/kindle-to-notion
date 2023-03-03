import { ValidatedAPIGatewayProxyEvent } from "@libs/apiGateway";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import Notion from "src/api/notion";

export const getEmailsDatabaseIdMiddleware = <B>(): middy.MiddlewareObject<
  ValidatedAPIGatewayProxyEvent<B>,
  APIGatewayProxyResult
> => {
  return {
    before: async (
      handler: middy.HandlerLambda<
        ValidatedAPIGatewayProxyEvent<B>,
        APIGatewayProxyResult,
        Context & { accessToken?: string }
      >
    ): Promise<void> => {
      const accessToken = handler.context.accessToken;

      if (!accessToken) {
        const error = createError(401, "Unauthorized");
        throw error;
      }

      const client = new Notion({ accessToken });

      const emailDatabaseIds = await client.getDatabaseIds("emails");

      if (!emailDatabaseIds.length) {
        const error = createError(404, "Could not find Notion databases");
        throw error;
      }

      const emailDatabaseId = emailDatabaseIds[0].id;

      handler.context["emailListId"] = emailDatabaseId;
    },
  };
};
