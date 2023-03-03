import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export type ValidatedAPIGatewayProxyEvent<B> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: B;
};

type StatusCode = 200 | 400 | 403 | 401;

export const makeResultResponse = (
  response: any,
  statusCode: StatusCode = 200
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(response),
  };
};
