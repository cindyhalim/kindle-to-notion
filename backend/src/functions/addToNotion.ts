import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { notion } from "../api/notion";
import { ValidatedAPIGatewayProxyEvent } from "../libs/apiGateway";

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

  if (!payload.length) {
    console.log("Nothing to append, returning early");
    return {
      statusCode: 200,
    };
  }

  console.log("Retrieving pages");
  const pages = await notion.getPages({ databaseId });

  for (const item of payload) {
    console.log(`Finding page for ${item.title} - ${item.author}`);
    const page = pages.find(
      ({ title, author }) => item.title === title && item.author === author
    );
    let pageId = page?.id || "";

    if (!page) {
      console.log(
        `No page found for ${item.title} - ${item.author}, creating new one`
      );
      const newPage = await notion.addPage({
        databaseId,
        title: item.title,
        author: item.author,
      });

      pageId = newPage.id;
    }

    console.log("Adding clippings to page");
    await notion.addClippingsToPage({ pageId, payload: item.clippings });
  }

  return {
    statusCode: 200,
  };
};

export const handler = middy(controller).use(jsonBodyParser());
