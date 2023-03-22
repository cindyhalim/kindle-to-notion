import middy from "@middy/core";
import { createError } from "@middy/util";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Notion from "src/api/notion";
import type { ContextWithToken } from "./authorizer";

export type ContextWithEmailListId = ContextWithToken & { emailListId: string };

export const getEmailsDatabaseIdMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  any,
  ContextWithEmailListId
> => {
  return {
    before: async (handler) => {
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
