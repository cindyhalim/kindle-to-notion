import { Context } from "aws-lambda";
import { Readable } from "stream";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { RawEmailListProperties } from "src/api/notion/types";
import { s3 } from "src/services/s3";
import Notion from "../api/notion";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";
import { mailer } from "@libs/mailer";
import { authorizerMiddleware } from "src/middlewares/authorizer";
import { getEmailsDatabaseIdMiddleware } from "src/middlewares/getEmailsDatabaseId";
const controller = async (
  event: ValidatedAPIGatewayProxyEvent<{
    uploadKey: string;
  }>,
  context: Context & { accessToken: string; emailListId: string }
) => {
  const { accessToken, emailListId: databaseId } = context;

  if (!event.body) {
    throw new Error("Missing payload");
  }

  const { uploadKey } = event.body;

  const notion = new Notion({ accessToken });

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

  if (!kindleEmail) {
    throw new Error("Cannot send with missing email(s)");
  }

  const file = (await s3.getObject({
    key: uploadKey,
  })) as Readable;

  try {
    await mailer.send({
      toEmail: kindleEmail,
      fileName: uploadKey,
      file,
    });
  } catch (e) {
    console.log("Error sending email", e);
  }

  await s3.deleteObject({ key: uploadKey });

  return makeResultResponse({ success: true });
};

export const handler = middy(controller)
  .use(jsonBodyParser())
  .use(authorizerMiddleware())
  .use(getEmailsDatabaseIdMiddleware());
