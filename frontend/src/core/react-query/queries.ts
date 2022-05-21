import axios, { AxiosResponse } from "axios";
import { config } from "../../environment";
import { RawGetBooksResponse } from "./types";

export const getBooks = async () => {
  const baseUrl = config.serviceUrl;
  const response: AxiosResponse<RawGetBooksResponse> = await axios.get(
    `${baseUrl}/read-list`
  );

  if (!response.data) {
    return [];
  }

  return response.data.data;
};
