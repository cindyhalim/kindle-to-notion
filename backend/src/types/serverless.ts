// Step function types from https://github.com/serverless-operations/serverless-step-functions/issues/370
import type { AWS } from "@serverless/typescript";

type AWSFunction = AWS["functions"][0];

interface AWSFunctionWithIAmRoleStatementsPerFunction extends AWSFunction {
  iamRoleStatements?: {
    Effect: string;
    Action: string[];
    Resource: {
      Ref: string;
    }[];
  }[];
}

export interface Serverless extends AWS {
  functions?: {
    [k: string]: AWSFunctionWithIAmRoleStatementsPerFunction;
  };
}
