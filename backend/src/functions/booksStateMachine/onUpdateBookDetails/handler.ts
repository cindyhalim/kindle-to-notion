import { makeResultResponse } from "@libs/apiGateway";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

import Notion from "src/api/notion";
import type {
  NotionPropertyData,
  RawReadingListProperties,
} from "src/api/notion/types";

import type { GetBookDetailsOutput, GetBookInfoInput } from "../types";

type UpdateBookDetailsInput = GetBookInfoInput & {
  details: GetBookDetailsOutput;
};

const onUpdateBookDetails = async (input: UpdateBookDetailsInput) => {
  const { pageId, details, token } = input;

  try {
    const properties: NotionPropertyData<RawReadingListProperties>[] = [
      ...(details.genres.length
        ? [
            {
              name: "genres" as const,
              value: details.genres,
            },
          ]
        : []),
      ...(details.coverUrl
        ? [
            {
              name: "book cover" as const,
              value: details.coverUrl,
            },
          ]
        : []),
      ...(details.pages
        ? [
            {
              name: "pages" as const,
              value: Number(details.pages),
            },
          ]
        : []),
    ];

    const notion = new Notion({ accessToken: token });

    const response =
      await notion.updatePageProperties<RawReadingListProperties>({
        pageId,
        properties,
      });
    return makeResultResponse({ response });
  } catch (e) {
    throw new Error("Error updating book details in Notion", e);
  }
};

export const main = middy(onUpdateBookDetails).use(jsonBodyParser());
