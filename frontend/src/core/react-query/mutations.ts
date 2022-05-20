import axios, { AxiosResponse } from "axios";
import { config } from "../../environment";
import { IFormattedClipping } from "../../utils";
import {
  RawGetBooksResponse,
  RawCreateUploadUrlResponse,
  UpdateBooksPayload,
} from "./types";

const baseUrl = config.serviceUrl;
const databaseId = config.notionDatabaseId;

export const authenticate = async ({ code }: { code: string }) => {
  const payload = { code };
  const response: AxiosResponse<{ accessToken: string }> = await axios.post(
    `${baseUrl}/authenticate`,
    payload
  );

  return response.data;
};

export const updateBooks = async (payload: UpdateBooksPayload) => {
  const response: AxiosResponse<RawGetBooksResponse> = await axios.post(
    `${baseUrl}/databases/${databaseId}/books`,
    payload
  );

  return response.data;
};

export const exportClippingsToNotion = async (
  payload: IFormattedClipping[]
) => {
  const response = await axios.post(
    `${baseUrl}/databases/${databaseId}/clippings/export`,
    {
      payload,
    }
  );

  return response.data;
};

export const sendToKindle = async ({ uploadKey }: { uploadKey: string }) => {
  // TODO: replace this hard coded id
  const databaseId = "6b64e8279cb0426caeb832fc89cbc2a8";
  const response = await axios.post(
    `${baseUrl}/databases/${databaseId}/kindle`,
    { uploadKey }
  );

  return response.data;
};

export const createUploadUrl = async ({ key }: { key: string }) => {
  const baseUrl = config.serviceUrl;
  const databaseId = config.notionDatabaseId;

  const response: AxiosResponse<RawCreateUploadUrlResponse> = await axios.post(
    `${baseUrl}/databases/${databaseId}/presigned-url`,
    { key }
  );

  return response.data;
};

export const uploadFile = async ({
  url,
  file,
}: {
  url: string;
  file: File | null;
}) => {
  if (!file) {
    return;
  }

  return await axios.put(url, file);
};
