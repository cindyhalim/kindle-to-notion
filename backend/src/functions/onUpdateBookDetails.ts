import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { notion, NotionPropertyData, Properties } from "src/api/notion";
import type {
  IGetBookDetailsOutput,
  IGetBookInfoPayload,
} from "src/types/functions";
import { makeResultResponse } from "../libs/apiGateway";

interface IUpdateBookDetailsEvent extends IGetBookInfoPayload {
  details: IGetBookDetailsOutput;
}

const controller = async (event: IUpdateBookDetailsEvent) => {
  const { pageId, details } = event;

  const propertyData: NotionPropertyData[] = [
    ...(details.genre.length && [
      {
        propertyName: "genre",
        propertyType: Properties.MULTI_SELECT,
        data: details.genre,
      },
    ]),
    ...(details.coverUrl && [
      {
        propertyName: "book cover",
        propertyType: Properties.FILES,
        data: details.coverUrl,
      },
    ]),
    ...(details.pages && [
      {
        propertyName: "pages",
        propertyType: Properties.RICH_TEXT,
        data: details.pages,
      },
    ]),
  ];

  try {
    const response = await notion.updatePage({ pageId, payload: propertyData });
    return makeResultResponse({ response });
  } catch (e) {
    throw new Error("Error updating book details in Notion", e);
  }
};

export const handler = middy(controller).use(jsonBodyParser());
