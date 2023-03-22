import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import type { Context } from "aws-lambda";

import Notion from "src/api/notion";
import { READING_LIST_PROPERTIES } from "src/api/notion/constants";
import type {
  NotionPropertyData,
  RawReadingListProperties,
} from "src/api/notion/types";

import { authorizerMiddleware } from "@middlewares/authorizer";
import { validateReadListDatabaseIdMiddleware } from "@middlewares/validateReadListDatabaseId";
import {
  makeResultResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import schema from "./schema";

type SaveBookToNotionContext = Context & { accessToken: string };

const saveBookToNotion: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event, context: SaveBookToNotionContext) => {
  const { isbn, title, author, genres, pages, coverUrl, goodreadsUrl } =
    event.body;
  const { accessToken } = context;
  const { databaseId } = event.pathParameters;

  const client = new Notion({ accessToken });

  console.log(`Looking up existing page for database ID: ${databaseId}`);
  const { pages: existingBookEntries } =
    await client.getPages<RawReadingListProperties>({
      databaseId,
      filter: {
        or: [
          {
            property: READING_LIST_PROPERTIES["isbn"].name,
            rich_text: {
              equals: isbn,
            },
          },
          {
            and: [
              {
                property: READING_LIST_PROPERTIES["title"].name,
                rich_text: {
                  contains: title,
                },
              },
              {
                property: READING_LIST_PROPERTIES["author"].name,
                rich_text: {
                  contains: author,
                },
              },
            ],
          },
        ],
      },
    });

  const properties: NotionPropertyData<RawReadingListProperties>[] = [
    {
      name: "title",
      value: title,
    },
    { name: "author", value: author },

    {
      name: "genres",
      value: genres,
    },
    {
      name: "isbn",
      value: isbn,
    },
    {
      name: "pages",
      value: pages ? Number(pages) : null,
    },
    ...(coverUrl && [
      {
        name: "book cover" as const,
        value: coverUrl,
      },
    ]),
    ...(goodreadsUrl && [
      {
        name: "goodreads link" as const,
        value: goodreadsUrl,
      },
    ]),
  ];

  if (!existingBookEntries.length) {
    console.log("No existing book found... creating new page");
    try {
      const { id, url } =
        await client.addPageToReadListDatabase<RawReadingListProperties>({
          databaseId,
          properties,
        });
      return makeResultResponse({
        pageId: id,
        pageUrl: url,
      });
    } catch (e) {
      console.log("Error adding new page to read list", e);
      return makeResultResponse(
        {
          message: "Failed to save book to notion",
        },
        400
      );
    }
  }

  // update existing page properties if it exists
  console.log("Existing book found... updating page");
  let pageId = existingBookEntries[0].id;
  let pageUrl = null;
  try {
    const { url } = await client.updatePageProperties<RawReadingListProperties>(
      {
        pageId,
        properties,
      }
    );
    pageUrl = url;
  } catch (e) {
    console.log("Error updating page with book details", e);
    return makeResultResponse(
      {
        message: "Failed to save book to notion",
      },
      400
    );
  }

  return makeResultResponse({
    pageId,
    pageUrl,
  });
};

export const main = middy(saveBookToNotion)
  .use(jsonBodyParser())
  .use(authorizerMiddleware())
  .use(validateReadListDatabaseIdMiddleware());
