import { ValidatedAPIGatewayProxyEvent } from "@libs/apiGateway";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import Notion from "src/api/notion";

export const getReadListDatabaseIdMiddleware = <B>(): middy.MiddlewareObj<
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

      const readListDatabaseIds = await client.getDatabaseIds(
        client.readListDatabaseTitle
      );

      if (!readListDatabaseIds.length) {
        const error = createError(404, "Could not find Notion databases");
        throw error;
      }

      const readListDatabaseId = readListDatabaseIds[0].id;

      handler.context["readListId"] = readListDatabaseId;
    },
  };
};
