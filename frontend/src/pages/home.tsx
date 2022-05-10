import React from "react";

import { GetBooksInfo } from "./book-scraper/get-books-info";
import { UploadClippingsToNotion } from "./clippings-to-notion";

export const Home = () => {
  return (
    <>
      <GetBooksInfo />
      <UploadClippingsToNotion />
    </>
  );
};
