import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { puppeteer } from "src/api/puppeteer";
import { s3 } from "src/services/s3";

type GetBookDetailsPayload = {
  executionName: string;
  databaseId: string;
  pageId: string;
  author: string;
  title: string;
  isbn: string;
};
const controller = async (input: GetBookDetailsPayload) => {
  const { title, executionName, isbn } = input;

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

    console.log("Getting book image url");
    const bookImageUrl = await page.$$eval('img[id="coverImage"]', (img) =>
      img?.[0]?.getAttribute("src")
    );

    console.log("Getting page count");
    const pageCount = await page.$eval(
      'span[itemprop="numberOfPages"]',
      (span: HTMLSpanElement) => span?.innerText || ""
    );

    console.log("Getting genres");
    const genres = await page.$$eval(
      'div.left > a[href^="/genres/"]',
      (genres: HTMLAnchorElement[]) =>
        genres.map((genre) => genre?.innerText).slice(0, 3)
    );

    await browser.close();

    console.log("Returning book details", { pageCount, genres, bookImageUrl });
    return {
      pageCount,
      genres,
      imageUrl: bookImageUrl,
    };
  } catch (e) {
    console.log("Error retrieving book details", e);
    const screenshot = await page.screenshot();
    const url = await s3.uploadObject({
      key: executionName,
      body: screenshot,
    });

    await browser.close();
    return {
      error: url,
    };
  }
};

export const handler = middy(controller).use(jsonBodyParser());
