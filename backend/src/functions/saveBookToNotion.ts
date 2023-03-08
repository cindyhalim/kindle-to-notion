import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import type { Context } from "aws-lambda";
import Notion from "src/api/notion";
import { READING_LIST_PROPERTIES } from "src/api/notion/constants";
import type {
  NotionPropertyData,
  RawReadingListProperties,
} from "src/api/notion/types";
import { authorizerMiddleware } from "src/middlewares/authorizer";
import { validateReadListDatabaseIdMiddleware } from "src/middlewares/validateReadListDatabaseId";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";

type SaveBookToNotionBody = {
  isbn: string;
  title: string;
  author: string;
  pages: string;
  genres: string[];
  coverUrl: string;
  goodreadsUrl: string;
};

type SaveBookToNotionContext = Context & { accessToken: string };

const controller = async (
  event: ValidatedAPIGatewayProxyEvent<SaveBookToNotionBody>,
  context: SaveBookToNotionContext
) => {
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
              equals: event.body.isbn,
            },
          },
          {
            and: [
              {
                property: READING_LIST_PROPERTIES["title"].name,
                rich_text: {
                  contains: event.body.title,
                },
              },
              {
                property: READING_LIST_PROPERTIES["author"].name,
                rich_text: {
                  contains: event.body.author,
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
      value: event.body.title,
    },
    { name: "author", value: event.body.author },

    {
      name: "genres",
      value: event.body.genres,
    },
    {
      name: "isbn",
      value: event.body.isbn,
    },
    {
      name: "pages",
      value: event.body.pages ? Number(event.body.pages) : null,
    },
    ...(event.body.coverUrl && [
      {
        name: "book cover" as const,
        value: event.body.coverUrl,
      },
    ]),
    ...(event.body.goodreadsUrl && [
      {
        name: "goodreads link" as const,
        value: event.body.goodreadsUrl,
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

export const handler = middy(controller)
  .use(jsonBodyParser())
  .use(authorizerMiddleware())
  .use(validateReadListDatabaseIdMiddleware());
