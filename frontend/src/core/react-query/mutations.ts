import axios, { AxiosResponse } from "axios";
import { config } from "../../environment";
import { RawGetBooksResponse, UpdateBooksPayload } from "./types";

export const updateBooks = async (payload: UpdateBooksPayload) => {
  const baseUrl = config.serviceUrl;
  const databaseId = config.notionDatabaseId;

  const response: AxiosResponse<RawGetBooksResponse> = await axios.post(
    `${baseUrl}/databases/${databaseId}/books`,
    payload
  );

  return response.data;
};
