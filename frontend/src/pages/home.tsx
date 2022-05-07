import React from "react";
import { BaseLayout } from "../layout/base-layout";
import { GetBooks } from "./book-scraper/get-books";

export const Home = () => {
  return (
    <>
      <GetBooks />
    </>
  );
};
