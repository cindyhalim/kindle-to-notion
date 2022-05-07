import type { APIGatewayProxyEvent } from "aws-lambda";
import { config } from "src/environment";

const allowedOrigins = [config.clientUrl];

export type ValidatedAPIGatewayProxyEvent<B> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: B;
};

export const makeResultResponse = <R>(response: R) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response),
  };
};
