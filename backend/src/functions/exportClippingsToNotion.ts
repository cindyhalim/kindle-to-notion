import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { READING_LIST_PROPERTIES } from "src/api/notion/constants";
import { RawReadingListProperties } from "src/api/notion/types";
import { notion } from "../api/notion";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";

export interface IClippingsPayload {
  title: string;
  author: string;
  clippings: { quote: string; info: string }[];
}

const controller = async (
  event: ValidatedAPIGatewayProxyEvent<{
    payload: IClippingsPayload[];
  }>
) => {
  const { databaseId } = event.pathParameters;
  const { payload } = event.body;

  if (!payload) {
    throw new Error("Missing payload");
  }

  if (!payload.length) {
    console.log("Nothing to append, returning early");
    makeResultResponse({ success: true });
  }

  console.log("Retrieving pages");
  const { pages: rawPages } = await notion.getPages<RawReadingListProperties>({
    databaseId,
    filter: null,
  });

  const pages = rawPages.map((page) => ({
    id: page.id,
    title: (
      page?.properties?.title?.title?.[0]?.text?.content ?? ""
    ).toLowerCase(),
    author: (
      page?.properties?.author?.rich_text?.[0]?.text?.content ?? ""
    ).toLowerCase(),
  }));

  for (const item of payload) {
    const payloadTitle = item.title.toLowerCase();
    const payloadAuthor = item.author.toLowerCase();
    console.log(`Finding page for ${item.title} - ${item.author}`);
    const page = pages.find(
      ({ title, author }) =>
        payloadTitle === title.toLowerCase() &&
        payloadAuthor === author.toLowerCase()
    );
    let pageId = page?.id || "";

    if (!pageId) {
      console.log(
        `No page found for ${item.title} - ${item.author}, creating new one`
      );

      const newPage = await notion.addPage<RawReadingListProperties>({
        databaseId,
        propertiesMap: READING_LIST_PROPERTIES,
        textProperties: [
          { key: "title", value: item.title },
          { key: "author", value: item.author },
        ],
      });

      pageId = newPage.id;
    }

    console.log("Adding clippings to page");
    await notion.addClippingsToPage({ pageId, payload: item.clippings });
  }

  return makeResultResponse({ success: true });
};

export const handler = middy(controller).use(jsonBodyParser());
