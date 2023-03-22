import Notion from "src/api/notion";
import type {
  NotionPropertyData,
  RawReadingListProperties,
} from "src/api/notion/types";
import { makeResultResponse } from "@libs/apiGateway";

import type { GetBookInfoInput, GetBookLinkOutput } from "../types";
import { middyfy } from "@libs/lambda";

type UpdateBookLinkInput = GetBookInfoInput & { url: GetBookLinkOutput };

const onUpdateBookLink = async (input: UpdateBookLinkInput) => {
  const { pageId, url, token } = input;

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

export const handler = middyfy(onUpdateBookLink);
