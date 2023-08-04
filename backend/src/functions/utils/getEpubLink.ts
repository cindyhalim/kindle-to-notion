import * as cheerio from "cheerio";
import fetch from "node-fetch";

export default async function getEpubLink({
  title,
  author,
}: {
  title: string;
  author: string;
}): Promise<string | null> {
  if (!title || !author) {
    throw new Error("Missing arguments");
  }

  const searchInputText = `${title} ${author} 'epub' free`.toLowerCase();
  const urlParams = new URLSearchParams(searchInputText);
  const searchUrl = `https://www.google.com/search?q=${urlParams.toString()}&sourceid=chrome&ie=UTF-8`;
  let content = null;

  console.log("Retrieving epub link search results for:", title);

  try {
    content = await fetch(searchUrl).then((response) => response.text());
  } catch {
    throw Error("Error retrieving epub link");
  }

  const $ = cheerio.load(content);

  const possibleEpubLinks: string[] = [];

  $("div#main a").each((_, el) => {
    const href = $(el).attr("href");
    const urlPrefix = "/url?q=";

    if (href.startsWith(urlPrefix) && !href.includes("google.com")) {
      const link = href.replace(urlPrefix, "").split("&sa=")[0];
      possibleEpubLinks.push(link);
    }
  });

  const epubLinks = await Promise.all(
    possibleEpubLinks.filter(async (link) => await isValidLink(link))
  );

  return epubLinks?.[0] || null;
}

async function isValidLink(link: string): Promise<boolean> {
  try {
    const response = await fetch(link);
    return response.ok;
  } catch {
    return false;
  }
}
