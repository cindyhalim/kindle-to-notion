import { S3 } from "aws-sdk";
import { config } from "src/environment";

const s3Client = new S3();

type UploadObjectPayload = {
  key: string;
  body: any;
};

const bucketName = config.kindleNotionBucketName;

const uploadObject = async ({
  key,
  body,
}: UploadObjectPayload): Promise<string> => {
  try {
    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: body,
    };
    await s3Client.putObject(params).promise();
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  } catch (e) {
    console.log("Error uploading object to s3", e);
  }
};

const getPresignedUrl = ({ key }: { key: string }) => {
  try {
    const signedUrlExpireSeconds = 60 * 5;
    return s3Client.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: `uploads/${key}`,
      Expires: signedUrlExpireSeconds,
    });
  } catch (e) {
    console.log("Error getting presigned url", e);
  }
};

const getObject = async ({ key }: { key: string }) => {
  try {
    const params: S3.GetObjectRequest = {
      Bucket: bucketName,
      Key: `uploads/${key}`,
    };
    const response = await s3Client.getObject(params).promise();

    return response?.Body;
  } catch (e) {
    if (e.code === "NoSuchKey") {
      return null;
    }
    throw e;
  }
};

const deleteObject = async ({ key }: { key: string }) => {
  try {
    const params: S3.DeleteObjectRequest = {
      Key: `uploads/${key}`,
      Bucket: bucketName,
    };
    return await s3Client.deleteObject(params).promise();
  } catch (e) {
    console.log("Error deleting object");
  }
};

export const s3 = { uploadObject, getPresignedUrl, getObject, deleteObject };
