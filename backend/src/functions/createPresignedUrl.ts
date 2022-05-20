import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { s3 } from "src/services/s3";

import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";

const controller = async (
  event: ValidatedAPIGatewayProxyEvent<{ key: string }>
) => {
  if (!event.body) {
    throw new Error("Missing event body");
  }

  const { key } = event.body;

  const url = s3.getPresignedUrl({ key });

  return makeResultResponse({ url });
};

export const handler = middy(controller).use(jsonBodyParser());
