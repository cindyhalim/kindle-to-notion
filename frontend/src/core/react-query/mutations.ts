import axios, { AxiosResponse } from "axios";
import { config } from "../../environment";
import { IFormattedClipping } from "../../utils";
import { RawGetBooksResponse, UpdateBooksPayload } from "./types";

const baseUrl = config.serviceUrl;
const databaseId = config.notionDatabaseId;

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
  const response = await axios.post(`${baseUrl}/databases/${databaseId}`, {
    payload,
  });

  return response.data;
};
