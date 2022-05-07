import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { puppeteer } from "src/api/puppeteer";

type GetBookDetailsPayload = {
  executionName: string;
  databaseId: string;
  pageId: string;
  author: string;
  title: string;
};
const controller = async (input: GetBookDetailsPayload) => {
  const { author, title, executionName } = input;
  const searchInputText = `${title} ${author}`.toLowerCase();

  const { page, browser } = await puppeteer.launchAndGoTo({
    link: "https://www.goodreads.com",
  });

  try {
    console.log("Searching book:", searchInputText);
    // search for book
    const searchFormInput = await page.waitForSelector(
      `div[id="searchBox"] input[type="text"]`
    );

    await searchFormInput.type(searchInputText);

    await page.keyboard.press("Enter");

    await page.waitForNavigation();

    // to escape login modal popup
    await page.reload({ waitUntil: "domcontentloaded" });

    console.log("Accessing book page");
    const bookLink = await page.waitForSelector(
      `tbody > tr > td > a[href^="/book/show/"]`
    );
    await bookLink.click();

    console.log("Getting book image url");
    let bookImageUrl = "";

    page.on("request", async (request) => {
      const url = await request.url();
      const imageUrl =
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/";
      if (!bookImageUrl && url.includes(imageUrl)) {
        bookImageUrl = url;
        return;
      }
    });

    await page.waitForNavigation();

    console.log("Getting page count");
    const pageCount = await page.$eval(
      'span[itemprop="numberOfPages"]',
      (span: HTMLSpanElement) => span.innerText
    );

    console.log("Getting genres");
    const genres = await page.$$eval(
      'div.left > a[href^="/genres/"]',
      (genres: HTMLAnchorElement[]) =>
        genres.map((genre) => genre.innerText).slice(0, 3)
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
    // TODO: get screenshot of page at point of failure
    const screenshot = await page.screenshot();
    const params = { Bucket: "", Key: executionName, Object: screenshot };

    await browser.close();
  }
};

export const handler = middy(controller).use(jsonBodyParser());
