import { AWS } from "@serverless/typescript";

export const kindleNotionBucket: AWS["resources"]["Resources"] = {
  KindleNotionBucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
      BucketName: "${self:provider.environment.KINDLE_NOTION_BUCKET_NAME}",
      AccessControl: "PublicRead",
    },
  },
};
