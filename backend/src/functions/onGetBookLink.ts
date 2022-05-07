import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { puppeteer } from "src/api/puppeteer";
import { makeResultResponse } from "../libs/apiGateway";

type GetBookLinkEvent = {
  databaseId: string;
  pageId: string;
  author: string;
  title: string;
};
const controller = async (event: GetBookLinkEvent) => {
  // const { databaseId, author, title, pageId } = event;
  // const searchInputText = `${title} ${author} epub free`.toLowerCase();

  const { browser } = await puppeteer.launchAndGoTo({
    link: "https://www.google.com",
  });

  try {
    // search for book

    await browser.close();
    return { ePubUrl: "" };
  } catch (e) {
    console.log("Error retrieving book link", e);
    // TODO: get screenshot of page at point of failure
    await browser.close();
  }
};

export const handler = middy(controller).use(jsonBodyParser());
