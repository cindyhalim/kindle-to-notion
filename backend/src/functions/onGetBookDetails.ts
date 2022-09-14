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

    await page.keyboard.press("Enter");

    await page.waitForNavigation();

    // if there is a pop up modal close it
    try {
      const popUpModalCloseButtonSelector = "div.modal__close > button";
      await page.waitForSelector("popUpModalCloseButtonSelector", {
        timeout: 50,
      });
      page.click(popUpModalCloseButtonSelector);
    } catch {
      // do nothing
    }

    console.log("Getting book cover url");
    const coverUrl = await page.$$eval('img[id="coverImage"]', (img) =>
      img?.[0]?.getAttribute("src")
    );

    console.log("Getting page count");
    const pageCount = await page.$eval(
      'span[itemprop="numberOfPages"]',
      (span: HTMLSpanElement) => span?.innerText || ""
    );
    const digitsOnlyRegex = new RegExp(/[0-9]/, "g");
    const pages = pageCount.match(digitsOnlyRegex).join("");

    console.log("Getting genre");
    const genre = await page.$$eval(
      'div.left > a[href^="/genres/"]',
      (genres: HTMLAnchorElement[]) =>
        genres.map((genre) => genre?.innerText?.toLowerCase()).slice(0, 3)
    );

    await browser.close();

    console.log("Returning book details", { pageCount, genre, coverUrl });
    return {
      pages,
      genre,
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
