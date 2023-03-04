import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import Notion from "src/api/notion";
import type {
  NotionPropertyData,
  RawReadingListProperties,
} from "src/api/notion/types";
import type {
  IGetBookDetailsOutput,
  IGetBookInfoPayload,
} from "src/types/functions";
import { makeResultResponse } from "../libs/apiGateway";

interface IUpdateBookDetailsEvent extends IGetBookInfoPayload {
  details: IGetBookDetailsOutput;
}

const controller = async (event: IUpdateBookDetailsEvent) => {
  const { pageId, details, token } = event;

  try {
    const properties: NotionPropertyData<RawReadingListProperties>[] = [
      ...(details.genre.length
        ? [
            {
              name: "genre" as const,
              value: details.genre,
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

export const handler = middy(controller).use(jsonBodyParser());
