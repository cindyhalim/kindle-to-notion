import { kindleNotionBucket } from "src/resources/s3";
import { bookInfoStateMachine } from "src/resources/step-functions";
import { Serverless } from "src/types/serverless";
import { handlerFunctions } from "./src/functions";

const serverlessConfiguration: Serverless = {
  service: "kindle-to-notion",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: [
    "serverless-webpack",
    "serverless-step-functions",
    "serverless-iam-roles-per-function",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-2",
    timeout: 30,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NOTION_TOKEN: "${ssm:/kindle-to-notion/notion-token}",
      CLIENT_URL: "https://master.djab0vgbepgeq.amplifyapp.com",
      KINDLE_NOTION_BUCKET_NAME: "${self:service.name}-${self:provider.stage}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: [
          { "Fn::GetAtt": ["KindleNotionBucket", "Arn"] },
          {
            "Fn::Join": [
              "/",
              [{ "Fn::GetAtt": ["KindleNotionBucket", "Arn"] }, "*"],
            ],
          },
        ],
      },
    ],
    lambdaHashingVersion: "20201221",
  },

  functions: { ...handlerFunctions },
  stepFunctions: {
    stateMachines: { ...bookInfoStateMachine },
  },
  resources: {
    Resources: {
      ...kindleNotionBucket,
    },
    Outputs: {
      BookInfoStateMachine: {
        Description: "The ARN of the state machine",
        Value: {
          Ref: "BookInfoStateMachine",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
