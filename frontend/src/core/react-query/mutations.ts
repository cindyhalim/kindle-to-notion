import axios, { AxiosResponse } from "axios";
import { config } from "../../environment";
import { IFormattedClipping } from "../../utils";
import {
  RawGetBooksResponse,
  RawCreateUploadUrlResponse,
  UpdateBooksPayload,
} from "./types";

const baseUrl = config.serviceUrl;

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
    `${baseUrl}/read-list`,
    payload
  );

  return response.data;
};

export const exportClippingsToNotion = async (
  payload: IFormattedClipping[]
) => {
  const response = await axios.post(`${baseUrl}/clippings/export`, {
    payload,
  });

  return response.data;
};

export const sendToKindle = async ({ uploadKey }: { uploadKey: string }) => {
  const response = await axios.post(`${baseUrl}/kindle`, { uploadKey });

  return response.data;
};

export const createUploadUrl = async ({ key }: { key: string }) => {
  const response: AxiosResponse<RawCreateUploadUrlResponse> = await axios.post(
    `${baseUrl}/presigned-url`,
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
  const uninterceptedAxiosInstance = axios.create();
  return await uninterceptedAxiosInstance.put(url, file);
};
