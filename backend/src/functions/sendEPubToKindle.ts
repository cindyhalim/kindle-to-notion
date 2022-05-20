import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { RawEmailListProperties } from "src/api/notion/types";
import { s3 } from "src/services/s3";
import { notion } from "../api/notion";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";
import { mailer } from "@libs/mailer";

const controller = async (
  event: ValidatedAPIGatewayProxyEvent<{
    uploadKey: string;
  }>
) => {
  const { databaseId } = event.pathParameters;

  if (!event.body) {
    throw new Error("Missing payload");
  }

  const { uploadKey } = event.body;

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

  // get file from s3
  const file = (await s3.getObject({
    key: uploadKey,
  })) as Buffer;

  // TODO: fix attachments not being recognized by kindle
  try {
    await mailer.send({
      fromEmail: amazonEmail,
      toEmail: kindleEmail,
      fileName: uploadKey,
      file,
    });
  } catch (e) {
    console.log("Error sending email", e);
  }

  s3.deleteObject({ key: uploadKey });

  return makeResultResponse({ success: true });
};

export const handler = middy(controller).use(jsonBodyParser());
