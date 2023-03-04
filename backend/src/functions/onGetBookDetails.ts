import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { puppeteer } from "@libs/puppeteer";
import { s3 } from "src/services/s3";
import {
  IGetBookDetailsOutput,
  IGetBookInfoPayload,
} from "src/types/functions";

const controller = async (
  input: IGetBookInfoPayload
): Promise<IGetBookDetailsOutput> => {
  const { title, executionName, isbn, isMissingDetails } = input;

  if (!isMissingDetails) {
    return {
      status: "ReturnEarly: returning early as book already has details",
    };
  }

  const { page, browser } = await puppeteer.launchAndGoTo({
    link: "https://www.goodreads.com",
  });

  try {
    console.log("Searching book:", title);
    // search for book
    const searchFormInput = await page.waitForSelector(
      `div[id="searchBox"] input[type="text"]`
    );

    await searchFormInput.type(isbn);

    await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);

    // if there is a pop up modal close it
    try {
      const popUpModalCloseButtonSelector = "div.modal__close > button";
      await page.waitForSelector("popUpModalCloseButtonSelector", {
        timeout: 50,
      });
      await page.click(popUpModalCloseButtonSelector);
    } catch {
      // do nothing
    }

    console.log("Getting book cover url");
    const coverUrl = await page.$$eval(
      "div.BookCover__image > div > img",
      (img) => img?.[0]?.getAttribute("src")
    );

    console.log("Getting page count");

    const pageCount = await page.$eval(
      'p[data-testid="pagesFormat"]',
      (p: HTMLParagraphElement) => p?.innerText.split(" ")[0] || ""
    );

    const digitsOnlyRegex = new RegExp(/[0-9]/, "g");
    const pages = pageCount.match(digitsOnlyRegex).join("");

    console.log("Getting genre");
    const genres = await page.$$eval(
      'span.BookPageMetadataSection__genreButton > a[href^="/genres/"]',
      (genres: HTMLSpanElement[]) =>
        genres.map((genre) => genre?.innerText?.toLowerCase())
    );

    await browser.close();

    console.log("Returning book details", { pageCount, genres, coverUrl });
    return {
      pages,
      genres,
      coverUrl: coverUrl,
    };
  } catch (e) {
    console.log("Error getting book details", e);
    const screenshot = await page.screenshot();
    const url = await s3.uploadObject({
      key: `screenshots/${executionName}.jpeg`,
      body: screenshot,
    });

    await browser.close();
    return {
      status: `Error retrieving book details– last screenshot: ${url}`,
    };
  }
};

export const handler = middy(controller).use(jsonBodyParser());
