import type { Context, APIGatewayProxyEvent } from "aws-lambda";

import { makeResultResponse } from "@libs/apiGateway";
import {
  authorizerMiddleware,
  type ContextWithToken,
} from "@middlewares/authorizer";
import Notion from "src/api/notion";
import { middyfy } from "@libs/lambda";

const getReadListDetails = async (
  _event: APIGatewayProxyEvent,
  context: ContextWithToken
) => {
  const { accessToken } = context;
  const client = new Notion({ accessToken });

  const readListDatabaseIds = await client.getDatabaseIds(
    client.readListDatabaseTitle
  );

  const pagesThatIncludeDatabaseIds = await Promise.all(
    readListDatabaseIds.map(async (readDatabase) => {
      const pageInfo = await client.getPageInfo(readDatabase.pageId);
      return {
        ...pageInfo,
        databaseId: readDatabase.id,
      };
    })
  );

  const pages = pagesThatIncludeDatabaseIds.filter((page) => !page.archived);

  return makeResultResponse({ pages });
};

export const main = middyfy(getReadListDetails).use(authorizerMiddleware());
