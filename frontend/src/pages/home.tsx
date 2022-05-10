import React from "react";

import { GetBooksInfo } from "./book-scraper/get-books-info";
import { UploadClippingsToNotion } from "./clippings-to-notion";
import { EPubToKindle } from "./epub-to-kindle";

export const Home = () => {
  return (
    <>
      <EPubToKindle />
      <GetBooksInfo />
      <UploadClippingsToNotion />
    </>
  );
};
