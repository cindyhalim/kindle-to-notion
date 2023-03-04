import { ValidatedAPIGatewayProxyEvent } from "@libs/apiGateway";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import Notion from "src/api/notion";

export const validateReadListDatabaseIdMiddleware = <
  B
>(): middy.MiddlewareObject<
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
      const accessToken = handler.context?.accessToken;
      const { databaseId } = handler.event.pathParameters;

      const client = new Notion({ accessToken });

      const databaseInfo = await client.getDatabaseInfo(databaseId);

      if (databaseInfo["title"]?.plain_text !== client.readListDatabaseTitle) {
        const error = createError(
          403,
          "Database ID does not correpond to a read list database"
        );
        throw error;
      }
    },
  };
};
