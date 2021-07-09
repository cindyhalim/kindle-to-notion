import type { AWS } from "@serverless/typescript";
import { handlerFunctions } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "kindle-to-notion",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
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
      CLIENT_URL: "https://master.djab0vgbepgeq.amplifyapp.com/",
    },
    lambdaHashingVersion: "20201221",
  },
  functions: { ...handlerFunctions },
};

module.exports = serverlessConfiguration;
