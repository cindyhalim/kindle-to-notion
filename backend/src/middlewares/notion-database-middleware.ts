import { ValidatedAPIGatewayProxyEvent } from "@libs/apiGateway";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import Notion from "src/api/notion";

export const getReadListDatabaseIdMiddleware = <B>(): middy.MiddlewareObject<
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

      const readListDatabaseId = await client.getDatabaseId("read list");

      if (!readListDatabaseId) {
        const error = createError(404, "Could not find Notion databases");
        throw error;
      }

      handler.context["readListId"] = readListDatabaseId;
    },
  };
};

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

      const emailDatabaseId = await client.getDatabaseId("emails");

      if (!emailDatabaseId) {
        const error = createError(404, "Could not find Notion databases");
        throw error;
      }

      handler.context["emailListId"] = emailDatabaseId;
    },
  };
};
