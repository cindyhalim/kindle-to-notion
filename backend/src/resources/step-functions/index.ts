import type { Serverless } from "../../types/serverless";

type StateMachine = Serverless["stepFunctions"]["stateMachines"];

const retrier = [
  {
    ErrorEquals: ["States.ALL"],
    IntervalSeconds: 1,
    MaxAttempts: 3,
    BackoffRate: 1.5,
  },
];

export const booksStateMachine: StateMachine = {
  BooksStateMachine: {
    id: "BooksStateMachine",
    name: "books-state-machine-${self:provider.stage}",
    definition: {
      Comment: "Orchestrates logic to retrieve book details and url",
      StartAt: "GetBookInfo",
      States: {
        GetBookInfo: {
          Type: "Parallel",
          End: true,
          Branches: [
            {
              StartAt: "GetBookDetails",
              States: {
                GetBookDetails: {
                  Type: "Task",
                  Resource: { "Fn::GetAtt": ["onGetBookDetails", "Arn"] },
                  ResultPath: "$.details",
                  Next: "ShouldUpdateBookDetails",
                },
                ShouldUpdateBookDetails: {
                  Type: "Choice",
                  Choices: [
                    {
                      Variable: "$.details.status",
                      IsPresent: false,
                      Next: "UpdateBookDetails",
                    },
                    {
                      Variable: "$.details.status",
                      IsPresent: true,
                      Next: "BookDetailsReturnEarly",
                    },
                  ],
                },
                UpdateBookDetails: {
                  Type: "Task",
                  Resource: { "Fn::GetAtt": ["onUpdateBookDetails", "Arn"] },
                  Retry: retrier,
                  End: true,
                },
                BookDetailsReturnEarly: {
                  Type: "Succeed",
                },
              },
            },
            {
              StartAt: "GetBookLink",
              States: {
                GetBookLink: {
                  Type: "Task",
                  Resource: { "Fn::GetAtt": ["onGetBookLink", "Arn"] },
                  ResultPath: "$.url",
                  Next: "ShouldUpdateBookLink",
                },
                ShouldUpdateBookLink: {
                  Type: "Choice",
                  Choices: [
                    {
                      Variable: "$.url.status",
                      IsPresent: false,
                      Next: "UpdateBookLink",
                    },
                    {
                      Variable: "$.url.status",
                      IsPresent: true,
                      Next: "BookLinkReturnEarly",
                    },
                  ],
                },
                UpdateBookLink: {
                  Type: "Task",
                  Resource: { "Fn::GetAtt": ["onUpdateBookLink", "Arn"] },
                  Retry: retrier,
                  End: true,
                },
                BookLinkReturnEarly: {
                  Type: "Succeed",
                },
              },
            },
          ],
        },
      },
    },
  },
};
