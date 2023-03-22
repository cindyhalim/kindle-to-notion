import { Readable } from "stream";

import { RawEmailListProperties } from "src/api/notion/types";
import Notion from "../../api/notion";

import { mailer } from "@libs/mailer";
import { s3 } from "@services/s3";
import {
  makeResultResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { authorizerMiddleware } from "@middlewares/authorizer";
import {
  type ContextWithEmailListId,
  getEmailsDatabaseIdMiddleware,
} from "@middlewares/getEmailsDatabaseId";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const sendEPubToKindle: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event, context: ContextWithEmailListId) => {
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

export const main = middyfy(sendEPubToKindle)
  .use(authorizerMiddleware())
  .use(getEmailsDatabaseIdMiddleware());
