import * as StepFunctions from "aws-sdk/clients/stepfunctions";
import { v4 as uuidv4 } from "uuid";

import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";

const stepFunctions = new StepFunctions();

type AddBookInfoEventBody = {
  books: {
    isbn: string;
    author: string;
    pageId: string;
    title: string;
  }[];
};
const controller = async (
  event: ValidatedAPIGatewayProxyEvent<AddBookInfoEventBody>
) => {
  if (!event.pathParameters.databaseId) {
    throw new Error("Missing database ID");
  }

  const { books } = event.body;
  const { databaseId } = event.pathParameters;

  try {
    const stateExecutions = books.map((book) => {
      const pageId = book.pageId;
      const executionName = `${pageId}_${uuidv4()}`;
      const stepFunctionInput = {
        executionName,
        databaseId,
        pageId,
        author: book.author,
        title: book.title,
        isbn: book.isbn,
      };
      stepFunctions
        .startExecution({
          stateMachineArn: process.env.STATE_MACHINE_ARN,
          name: executionName,
          input: JSON.stringify(stepFunctionInput),
        })
        .promise();
    });
    await Promise.all(stateExecutions);
    return makeResultResponse({
      success: true,
    });
  } catch (e) {
    console.log("Error in addBookInfo", e);
  }
};

export const handler = middy(controller).use(jsonBodyParser());
