import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

import {
  makeResultResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { authorizerMiddleware } from "@middlewares/authorizer";
import { s3 } from "@services/s3";

import schema from "./schema";

const createPresignedUrl: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  if (!event.body) {
    throw new Error("Missing event body");
  }

  const { key } = event.body;

  const url = s3.getPresignedUrl({ key });

  return makeResultResponse({ url });
};

export const main = middy(createPresignedUrl)
  .use(jsonBodyParser())
  .use(authorizerMiddleware());
