import middy from "@middy/core";
import { createError } from "@middy/util";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Notion from "src/api/notion";
import type { ContextWithToken } from "./authorizer";

export const validateReadListDatabaseIdMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  any,
  ContextWithToken
> => {
  return {
    before: async (handler) => {
      const accessToken = handler.context?.accessToken;
      const { databaseId } = handler.event.pathParameters;

      const client = new Notion({ accessToken });

      const databaseInfo = await client.getDatabaseInfo(databaseId);

      if (
        databaseInfo["title"]?.[0]?.plain_text !== client.readListDatabaseTitle
      ) {
        const error = createError(
          403,
          "Database ID does not correpond to a read list database"
        );
        throw error;
      }
    },
  };
};
