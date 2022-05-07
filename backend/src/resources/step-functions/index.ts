import type { Serverless } from "../../types/serverless";

type StateMachine = Serverless["stepFunctions"]["stateMachines"];

// const retrier = [
//   {
//     ErrorEquals: ["States.ALL"],
//     IntervalSeconds: 1,
//     MaxAttempts: 3,
//     BackoffRate: 1.5,
//   },
// ];

export const bookInfoStateMachine: StateMachine = {
  BookInfoStateMachine: {
    id: "BookInfoStateMachine",
    name: "book-info-state-machine-${self:provider.stage}",
    definition: {
      Comment: "Orchestrates retrieving book info",
      StartAt: "GetBookInfo",
      States: {
        GetBookInfo: {
          Type: "Parallel",
          Branches: [
            {
              StartAt: "GetBookDetails",
              States: {
                GetBookDetails: {
                  Type: "Task",
                  Resource: { "Fn::GetAtt": ["onGetBookDetails", "Arn"] },
                  ResultPath: "$.details",
                  End: true,
                },
              },
            },
            {
              StartAt: "GetBookLink",
              States: {
                GetBookLink: {
                  Type: "Task",
                  Resource: { "Fn::GetAtt": ["onGetBookLink", "Arn"] },
                  ResultPath: "$.link",
                  End: true,
                },
              },
            },
          ],
          Next: "UpdateReadingList",
        },
        UpdateReadingList: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onUpdateReadingList", "Arn"] },
          End: true,
        },
      },
    },
  },
};
