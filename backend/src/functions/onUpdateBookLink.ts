import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import Notion from "src/api/notion";
import type {
  NotionPropertyData,
  RawReadingListProperties,
} from "src/api/notion/types";
import type {
  IGetBookInfoPayload,
  IGetBookLinkOutput,
} from "src/types/functions";
import { makeResultResponse } from "../libs/apiGateway";

interface IUpdateBookLinkEvent extends IGetBookInfoPayload {
  url: IGetBookLinkOutput;
}

const controller = async (event: IUpdateBookLinkEvent) => {
  const { pageId, url, token } = event;

  try {
    const properties: NotionPropertyData<RawReadingListProperties>[] = [
      ...(url.ePub && [
        {
          name: "epub link" as const,
          value: url.ePub,
        },
      ]),
    ];

    const notion = new Notion({ accessToken: token });
    const response =
      await notion.updatePageProperties<RawReadingListProperties>({
        pageId,
        properties,
      });
    return makeResultResponse({ response });
  } catch (e) {
    throw new Error("Error updating book link in Notion", e);
  }
};

export const handler = middy(controller).use(jsonBodyParser());
