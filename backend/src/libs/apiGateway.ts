import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { config } from "src/environment";

export type ValidatedAPIGatewayProxyEvent<B> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: B;
};

export const makeResultResponse = (response): APIGatewayProxyResult => {
  const allowedOrigin = config.clientUrl;

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
    },
    body: JSON.stringify(response),
  };
};
