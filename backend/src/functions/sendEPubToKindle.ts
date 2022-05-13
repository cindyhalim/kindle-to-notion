import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { RawEmailListProperties } from "src/api/notion/types";
import { notion } from "../api/notion";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";

export interface ISendEPubToKindlePayload {
  files: File[];
}

const controller = async (
  event: ValidatedAPIGatewayProxyEvent<{
    payload: ISendEPubToKindlePayload;
  }>
) => {
  const { databaseId } = event.pathParameters;
  const { payload } = event.body;

  if (!payload) {
    throw new Error("Missing payload");
  }

  console.log("Retrieving email page");

  const { pages } = await notion.getPages<RawEmailListProperties>({
    databaseId,
    filter: null,
  });

  const kindleEmail =
    pages.filter(
      (page) =>
        page?.properties?.key?.title?.[0]?.text?.content === "kindle email"
    )?.[0]?.properties?.value?.rich_text?.[0]?.text?.content || "";

  const amazonEmail =
    pages.filter(
      (page) =>
        page?.properties?.key?.title?.[0]?.text?.content === "amazon email"
    )?.[0]?.properties?.value?.rich_text?.[0]?.text?.content || "";

  if (!kindleEmail || !amazonEmail) {
    throw new Error("Cannot send with missing email(s)");
  }

  // create email

  // can send up to 25 attachments in one email*

  // total size of 50 mb or less*

  // might need to type convert in subject line to convert document into kindle format*
  return makeResultResponse({ success: true });
};

export const handler = middy(controller).use(jsonBodyParser());
