import { S3 } from "aws-sdk";
import { config } from "src/environment";

const s3Client = new S3();

type UploadObjectPayload = {
  key: string;
  body: any;
};
const uploadObject = async ({
  key,
  body,
}: UploadObjectPayload): Promise<string> => {
  try {
    const bucketName = config.kindleNotionBucketName;
    const formattedKey = `${key}.jpeg`;
    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: formattedKey,
      Body: body,
    };
    await s3Client.putObject(params).promise();
    return `https://${bucketName}.s3.amazonaws.com/${formattedKey}`;
  } catch (e) {
    console.log("Error uploading object to s3", e);
  }
};

export const s3 = { uploadObject };
