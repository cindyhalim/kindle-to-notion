import { makeResultResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { authorizerMiddleware } from "@middlewares/authorizer";
import { getReadListDatabaseIdMiddleware } from "@middlewares/getReadListDatabaseId";
import type { APIGatewayEvent, Context } from "aws-lambda";
import { READING_LIST_PROPERTIES } from "src/api/notion/constants";
import { RawReadingListProperties } from "src/api/notion/types";

import Notion from "../../api/notion";

const getBooksWithMissingInfo = async (
  _event: APIGatewayEvent,
  context: Context & { accessToken: string; readListId: string }
) => {
  try {
    const { accessToken, readListId: databaseId } = context;

    console.log("Retrieving books with missing fields");
    const { pages } = await new Notion({
      accessToken,
    }).getPages<RawReadingListProperties>({
      databaseId,
      filter: {
        or: [
          {
            property: READING_LIST_PROPERTIES["has epub link"].name,
            checkbox: {
              equals: false,
            },
          },
          {
            property: READING_LIST_PROPERTIES["has details"].name,
            checkbox: {
              equals: false,
            },
          },
        ],
      },
    });

    console.log("Query successful, formatting data");

    const booksWithMissingFields = pages.map((page) => ({
      pageId: page.id,
      title: page?.properties?.title?.title?.[0]?.plain_text ?? "",
      author: page?.properties?.author?.rich_text?.[0]?.plain_text ?? "",
      isMissingLink: !page?.properties?.["has epub link"]?.formula?.boolean,
      isMissingDetails: !page?.properties?.["has details"]?.formula?.boolean,
      isbn: page?.properties?.isbn?.rich_text?.[0]?.plain_text ?? "",
    }));

    const formattedBooksWithMissingFields = booksWithMissingFields.reduce(
      (prev, curr) => {
        const requiredFields = [curr.title, curr.author, curr.isbn];
        if (requiredFields.every(Boolean)) {
          return [...prev, curr];
        }
        return prev;
      },
      []
    );

    return makeResultResponse({ data: formattedBooksWithMissingFields });
  } catch (e) {
    console.log("Error retrieving books with missing fields", e);
  }
};

export const main = middyfy(getBooksWithMissingInfo)
  .use(authorizerMiddleware())
  .use(getReadListDatabaseIdMiddleware());
