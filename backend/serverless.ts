import { kindleNotionBucket } from "src/resources/s3";
import { booksStateMachine } from "src/resources/step-functions";
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
      NOTION_CLIENT_ID: "${ssm:/kindle-to-notion/notion-client-id}",
      NOTION_CLIENT_SECRET: "${ssm:/kindle-to-notion/notion-client-secret}",
      CLIENT_URL: "https://notion-kindle.netlify.app",
      KINDLE_NOTION_BUCKET_NAME: "${self:service.name}",
      MAILER_EMAIL: "${ssm:/kindle-to-notion/transporter-email}",
      MAILER_PASSWORD: "${ssm:/kindle-to-notion/transporter-password}",
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
    stateMachines: { ...booksStateMachine },
  },
  resources: {
    Resources: {
      ...kindleNotionBucket,
    },
    Outputs: {
      BooksStateMachine: {
        Description: "The ARN of the state machine",
        Value: {
          Ref: "BooksStateMachine",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
