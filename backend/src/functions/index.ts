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
  authenticate: {
    handler: "src/functions/authenticate.handler",
    events: [
      {
        http: {
          method: "post",
          path: "/authenticate",
          cors: true,
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
  exportClippingsToNotion: {
    handler: "src/functions/exportClippingsToNotion.handler",
    events: [
      {
        http: {
          method: "post",
          path: `/databases/{databaseId}/clippings/export`,
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
  createPresignedUrl: {
    handler: "src/functions/createPresignedUrl.handler",
    events: [
      {
        http: {
          method: "post",
          path: `databases/{databaseId}/presigned-url`,
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
  sendEPubToKindle: {
    handler: "src/functions/sendEPubToKindle.handler",
    events: [
      {
        http: {
          method: "post",
          path: `/databases/{databaseId}/kindle/`,
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
};
