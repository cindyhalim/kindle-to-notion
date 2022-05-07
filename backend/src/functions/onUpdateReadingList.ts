import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent } from "aws-lambda";
import { makeResultResponse } from "../libs/apiGateway";

const controller = async (event: APIGatewayEvent) => {
  return makeResultResponse({ success: true });
};

export const handler = middy(controller).use(jsonBodyParser());
