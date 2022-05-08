import type { Serverless } from "src/types/serverless";

export const handlerFunctions: Serverless["functions"] = {
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
          cors: true,
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
  addBookInfo: {
    handler: "src/functions/addBookInfo.handler",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["states:startExecution"],
        Resource: [{ Ref: "BooksStateMachine" }],
      },
    ],
    environment: {
      STATE_MACHINE_ARN: "${self:resources.Outputs.BooksStateMachine.Value}",
    },
    events: [
      {
        http: {
          method: "post",
          path: `/databases/{databaseId}/books`,
          cors: true,
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
  onGetBookDetails: {
    handler: "src/functions/onGetBookDetails.handler",
  },
  onGetBookLink: {
    handler: "src/functions/onGetBookLink.handler",
  },
  onUpdateBookDetails: {
    handler: "src/functions/onUpdateBookDetails.handler",
  },
  onUpdateBookLink: {
    handler: "src/functions/onUpdateBookLink.handler",
  },
  // addToNotion: {
  //   handler: "src/functions/addToNotion.handler",
  //   events: [
  //     {
  //       http: {
  //         method: "post",
  //         path: `/databases/{databaseId}`,
  //         request: {
  //           parameters: {
  //             paths: {
  //               databaseId: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
};
