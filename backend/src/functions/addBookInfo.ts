import * as StepFunctions from "aws-sdk/clients/stepfunctions";
import { v4 as uuidv4 } from "uuid";

import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import {
  makeResultResponse,
  ValidatedAPIGatewayProxyEvent,
} from "../libs/apiGateway";
import { authorizerMiddleware } from "src/middlewares/authorizer";
import { getReadListDatabaseIdMiddleware } from "src/middlewares/notion-database-middleware";
import { Context } from "aws-lambda";

const stepFunctions = new StepFunctions();

type AddBookInfoEventBody = {
  books: {
    isbn: string;
    author: string;
    pageId: string;
    title: string;
    isMissingDetails: boolean;
    isMissingLink: boolean;
  }[];
};
const controller = async (
  event: ValidatedAPIGatewayProxyEvent<AddBookInfoEventBody>,
  context: Context & { accessToken: string; readListId: string }
) => {
  const { books } = event.body;
  const { accessToken, readListId: databaseId } = context;

  try {
    const stateExecutions = books.map((book) => {
      const executionName = `${book.pageId}_${uuidv4()}`;
      const stepFunctionInput = {
        executionName,
        databaseId,
        ...book,
        token: accessToken,
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

export const handler = middy(controller)
  .use(jsonBodyParser())
  .use(authorizerMiddleware())
  .use(getReadListDatabaseIdMiddleware());
