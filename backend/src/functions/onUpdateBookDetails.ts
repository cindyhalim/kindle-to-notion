import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import Notion from "src/api/notion";
import {
  NotionPropertyData,
  Properties,
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
    const propertyData: NotionPropertyData<RawReadingListProperties>[] = [
      ...(details.genre.length
        ? [
            {
              propertyName: "genre" as const,
              propertyType: Properties.MULTI_SELECT,
              data: details.genre,
            },
          ]
        : []),
      ...(details.coverUrl
        ? [
            {
              propertyName: "book cover" as const,
              propertyType: Properties.FILES,
              data: details.coverUrl,
            },
          ]
        : []),
      ...(details.pages
        ? [
            {
              propertyName: "pages" as const,
              propertyType: Properties.NUMBER,
              data: Number(details.pages),
            },
          ]
        : []),
    ];

    const notion = new Notion({ accessToken: token });

    const response =
      await notion.updatePageProperties<RawReadingListProperties>({
        pageId,
        payload: propertyData,
      });
    return makeResultResponse({ response });
  } catch (e) {
    throw new Error("Error updating book details in Notion", e);
  }
};

export const handler = middy(controller).use(jsonBodyParser());
