import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { puppeteer } from "@libs/puppeteer";
import { s3 } from "src/services/s3";
import { IGetBookInfoPayload, IGetBookLinkOutput } from "src/types/functions";

const controller = async ({
  title,
  author,
  executionName,
  isMissingLink,
}: IGetBookInfoPayload): Promise<IGetBookLinkOutput> => {
  if (!isMissingLink) {
    return { status: "ReturnEarly: returning early as book already has link" };
  }

  const searchInputText = `${title} ${author} epub free`.toLowerCase();
  const urlParams = new URLSearchParams(searchInputText);

  const { browser, page } = await puppeteer.launchAndGoTo({
    link: `https://www.google.com/search?q=${urlParams}`,
  });

  try {
    console.log("Searching for epub link for:", title);
    const ePubUrls = await page.$$eval("a", (elements: HTMLAnchorElement[]) =>
      elements
        .map((element) => element.href)
        .filter((link) => link && !link.includes("google.com"))
    );

    console.log(ePubUrls);
    const ePubUrl = ePubUrls[0] ?? null;

    await browser.close();

    if (!ePubUrl) {
      return {
        status: `ReturnEarly: no epub url found`,
      };
    }

    return { ePub: ePubUrl };
  } catch (e) {
    console.log("Error retrieving book link", e);
    const screenshot = await page.screenshot();
    const url = await s3.uploadObject({
      key: executionName,
      body: screenshot,
    });

    await browser.close();
    return {
      status: `Error retrieving book link last screenshot: ${url}`,
    };
  }
};

export const handler = middy(controller).use(jsonBodyParser());
