import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { notion, NotionPropertyData, Properties } from "src/api/notion";
import { RawReadingListProperties } from "src/api/notion/types";
import type {
  IGetBookInfoPayload,
  IGetBookLinkOutput,
} from "src/types/functions";
import { makeResultResponse } from "../libs/apiGateway";

interface IUpdateBookLinkEvent extends IGetBookInfoPayload {
  url: IGetBookLinkOutput;
}

const controller = async (event: IUpdateBookLinkEvent) => {
  const { pageId, url } = event;

  const propertyData: NotionPropertyData<RawReadingListProperties>[] = [
    ...(url.ePub && [
      {
        propertyName: "epub link" as const,
        propertyType: Properties.URL,
        data: url.ePub,
      },
    ]),
  ];

  try {
    const response =
      await notion.updatePageProperties<RawReadingListProperties>({
        pageId,
        payload: propertyData,
      });
    return makeResultResponse({ response });
  } catch (e) {
    throw new Error("Error updating book link in Notion", e);
  }
};

export const handler = middy(controller).use(jsonBodyParser());
