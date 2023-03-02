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
          request: {
            parameters: {
              querystrings: {
                mode: false,
              },
            },
          },
          cors: true,
        },
      },
    ],
  },
  getReadListDetails: {
    handler: "src/functions/getReadListDetails.handler",
    events: [
      {
        http: {
          method: "get",
          path: "/read-list/details",
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
          path: "/read-list",
          cors: true,
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
          path: "/read-list",
          cors: true,
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
          path: "/clippings/export",
          cors: true,
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
          path: "/presigned-url",
          cors: true,
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
          path: "/kindle",
          cors: true,
        },
      },
    ],
  },
};
