import { AWS } from "@serverless/typescript";

export const handlerFunctions: AWS["functions"] = {
  check: {
    handler: "src/functions/check.handler",
    events: [
      {
        http: {
          method: "get",
          path: "/",
        },
      },
    ],
  },
  getBooksWithMissingInfo: {
    handler: "src/functions/getBooksWithMissingInfo.handler",
    events: [
      {
        http: {
          method: "get",
          path: `/databases/{databaseId}/books`,
          request: {
            parameters: {
              paths: {
                databaseId: true,
              },
            },
          },
        },
      },
    ],
  },
  addToNotion: {
    handler: "src/functions/addToNotion.handler",
    events: [
      {
        http: {
          method: "post",
          path: `/databases/{databaseId}`,
          request: {
            parameters: {
              paths: {
                databaseId: true,
              },
            },
          },
        },
      },
    ],
  },
};
