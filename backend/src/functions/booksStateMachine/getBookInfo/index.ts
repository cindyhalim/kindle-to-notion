import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
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
};
