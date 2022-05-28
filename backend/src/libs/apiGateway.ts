import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { config } from "src/environment";

export type ValidatedAPIGatewayProxyEvent<B> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: B;
};

export const makeResultResponse = (response): APIGatewayProxyResult => {
  const allowOrigin = config.clientUrl;
  console.log("hii allow origin", allowOrigin);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(response),
  };
};
