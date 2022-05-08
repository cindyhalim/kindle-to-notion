import axios, { AxiosResponse } from "axios";
import { config } from "../../environment";
import { RawGetBooksResponse } from "./types";

export const getBooks = async () => {
  const baseUrl = config.serviceUrl;
  const databaseId = config.notionDatabaseId;
  const response: AxiosResponse<RawGetBooksResponse> = await axios.get(
    `${baseUrl}/databases/${databaseId}/books`
  );

  if (!response.data) {
    return [];
  }

  return response.data.data;
};
