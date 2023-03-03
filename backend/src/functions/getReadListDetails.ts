import middy from "@middy/core";

import { makeResultResponse } from "../libs/apiGateway";
import type { Context, APIGatewayProxyEvent } from "aws-lambda";
import { authorizerMiddleware } from "src/middlewares/authorizer";
import Notion from "src/api/notion";

type GetReadListContext = Context & { accessToken: string };

const controller = async (
  _event: APIGatewayProxyEvent,
  context: GetReadListContext
) => {
  const { accessToken } = context;
  const client = new Notion({ accessToken });

  const readListDatabaseIds = await client.getDatabaseIds("read list");

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

export const handler = middy(controller).use(authorizerMiddleware());
