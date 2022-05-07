import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent } from "aws-lambda";
import { notion } from "../api/notion";
import { makeResultResponse } from "../libs/apiGateway";

const controller = async (event: APIGatewayEvent) => {
  if (!event.pathParameters.databaseId) {
    throw new Error("Missing database ID");
  }

  const { databaseId } = event.pathParameters;

  console.log("Retrieving books with missing fields");
  const booksWithMissingFields = await notion.getBooksWithMissingFields({
    databaseId,
  });

  return makeResultResponse({ data: booksWithMissingFields });
};

export const handler = middy(controller).use(jsonBodyParser());
