import { kindleNotionBucket } from 'src/resources/s3'
import type { Serverless } from 'src/types/serverless'
import { handlerFunctions } from './src/functions'

const serverlessConfiguration: Serverless = {
  service: 'kindle-to-notion',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-2',
    versionFunctions: false,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NOTION_CLIENT_ID: '${ssm:/kindle-to-notion/notion-client-id}',
      NOTION_CLIENT_SECRET: '${ssm:/kindle-to-notion/notion-client-secret}',
      EXTENSION_NOTION_CLIENT_ID:
        '${ssm:/kindle-to-notion/extension-notion-client-id}',
      EXTENSION_NOTION_CLIENT_SECRET:
        '${ssm:/kindle-to-notion/extension-notion-client-secret}',
      GOOGLE_SEARCH_API_KEY: '${ssm:/kindle-to-notion/google-search-api-key}',
      GOOGLE_CUSTOM_SEARCH_ENGINE_ID:
        '${ssm:/kindle-to-notion/google-search-custom-search-engine-id}',
      CLIENT_URL: 'https://notion-kindle.netlify.app',
      KINDLE_NOTION_BUCKET_NAME: '${self:service}',
      MAILER_USERNAME: '${ssm:/kindle-to-notion/transporter-email}',
      MAILER_PASSWORD: '${ssm:/kindle-to-notion/transporter-password}',
      MAILER_CLIENT_ID: '${ssm:/kindle-to-notion/transporter-client-id}',
      MAILER_CLIENT_SECRET:
        '${ssm:/kindle-to-notion/transporter-client-secret}',
      MAILER_REFRESH_TOKEN:
        '${ssm:/kindle-to-notion/transporter-refresh-token}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [
          { 'Fn::GetAtt': ['KindleNotionBucket', 'Arn'] },
          {
            'Fn::Join': [
              '/',
              [{ 'Fn::GetAtt': ['KindleNotionBucket', 'Arn'] }, '*'],
            ],
          },
        ],
      },
    ],
    lambdaHashingVersion: '20201221',
  },
  functions: { ...handlerFunctions },
  resources: {
    Resources: {
      ...kindleNotionBucket,
    },
  },
}

module.exports = serverlessConfiguration
