import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import type { Context } from "aws-lambda";

import {
  makeResultResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import Notion from "src/api/notion";
import { RawReadingListProperties } from "src/api/notion/types";

import schema from "./schema";
import { authorizerMiddleware } from "@middlewares/authorizer";
import { getReadListDatabaseIdMiddleware } from "@middlewares/getReadListDatabaseId";

const exportClippingsToNotion: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (
  event,
  context: Context & { accessToken: string; readListId: string }
) => {
  const { payload } = event.body;
  const { accessToken, readListId: databaseId } = context;

  if (!payload) {
    throw new Error("Missing payload");
  }

  if (!payload.length) {
    console.log("Nothing to append, returning early");
    makeResultResponse({ success: true });
  }

  const notion = new Notion({ accessToken });

  console.log("Retrieving pages");
  const { pages: rawPages } = await notion.getPages<RawReadingListProperties>({
    databaseId,
    filter: null,
  });

  const pages = rawPages.map((page) => ({
    id: page.id,
    title: (
      page?.properties?.title?.title?.[0]?.text?.content ?? ""
    ).toLowerCase(),
    author: (
      page?.properties?.author?.rich_text?.[0]?.text?.content ?? ""
    ).toLowerCase(),
  }));

  for (const item of payload) {
    const payloadTitle = item.title.toLowerCase();
    const payloadAuthor = item.author.toLowerCase();
    console.log(`Finding page for ${item.title} - ${item.author}`);
    const page = pages.find(
      ({ title, author }) =>
        payloadTitle === title.toLowerCase() &&
        payloadAuthor === author.toLowerCase()
    );
    let pageId = page?.id || "";

    if (!pageId) {
      console.log(
        `No page found for ${item.title} - ${item.author}, creating new one`
      );

      const newPage =
        await notion.addPageToReadListDatabase<RawReadingListProperties>({
          databaseId,
          properties: [
            { name: "title", value: item.title },
            { name: "author", value: item.author },
          ],
        });

      pageId = newPage.id;
    }

    console.log("Adding clippings to page");
    await notion.appendClippingsToPage({ pageId, payload: item.clippings });
  }

  return makeResultResponse({ success: true });
};

export const handler = middy(exportClippingsToNotion)
  .use(jsonBodyParser())
  .use(authorizerMiddleware())
  .use(getReadListDatabaseIdMiddleware());
