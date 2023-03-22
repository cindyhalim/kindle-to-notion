import { v4 as uuidv4 } from "uuid";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

import {
  makeResultResponse,
  type ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import type { Context } from "aws-lambda";

import { authorizerMiddleware } from "@middlewares/authorizer";
import { getReadListDatabaseIdMiddleware } from "@middlewares/getReadListDatabaseId";
import { stepFunctions } from "@services/stepFunctions";

import schema from "./schema";

const getBookInfo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
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

export const main = middy(getBookInfo)
  .use(jsonBodyParser())
  .use(authorizerMiddleware())
  .use(getReadListDatabaseIdMiddleware());
