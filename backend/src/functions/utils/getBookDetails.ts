import * as cheerio from "cheerio";
import { puppeteer } from "@libs/puppeteer";
import fetch from "node-fetch";

type BookSchemaJsonLd = {
  "@context": "https://schema.org";
  "@type": "Book";
  name: string;
  image: string;
  numberOfPages: number;
  isbn: string;
  author: [
    {
      "@type": "Person";
      name: string;
      url: string;
    }
  ];
};

type BookDetails = {
  isbn: string;
  title: string;
  author: string;
  goodreadsUrl: string;
  pages: string;
  genre: string[];
  coverUrl: string;
};

export default async function getBookDetails(
  isbn: string
): Promise<BookDetails> {
  const { page, browser } = await puppeteer.launchAndGoTo({
    link: "https://www.goodreads.com",
  });

  let bookUrl = null;

  try {
    console.log(`Searching for book with ISBN: ${isbn}`);
    const searchFormInput = await page.waitForSelector(
      `div[id="searchBox"] input[type="text"]`
    );
    await searchFormInput.type(isbn);

    await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
    bookUrl = await page.evaluate(() => document.location.href);
    await browser.close();
  } catch (e) {
    console.log("Error fetching Goodreads book URL", e);
    throw Error("Error fetching Goodreads book URL");
  }

  let content = null;

  console.log(`Book url found: ${bookUrl}`);
  try {
    content = await fetch(bookUrl).then((response) => response.text());
  } catch {
    throw Error("Error retrieving URL content");
  }

  const $ = cheerio.load(content);
  const head = $("head");

  const jsonLdTags = [];

  console.log("Retrieving book schema...");
  head.find('script[type="application/ld+json"]').each((_, jsonLdTag) => {
    jsonLdTag.children.forEach((el) => {
      jsonLdTags.push((el as any).data);
    });
  });

  const SCHEMA_KEY_VALUE_PAIR = `"@context":"https://schema.org"`;
  const bookSchema = jsonLdTags.find((jsonLdTag) =>
    jsonLdTag.includes(SCHEMA_KEY_VALUE_PAIR)
  );

  if (!bookSchema) {
    throw Error("Cannot find book schema");
  }

  const parsedBookSchema: BookSchemaJsonLd = JSON.parse(bookSchema);
  const author = parsedBookSchema.author
    .map((author) => author.name)
    .toString()
    .replace(/,/g, ", ");

  const body = $("body");

  console.log("Retrieving genres...");
  const rawGenresListText = body.find('div[data-testid="genresList"]').text();
  const rawGenres = rawGenresListText.split("Genres")[1].split("...more")[0]; // returns 'FictionMysteryThrillerMystery ThrillerCrime'

  const formattedGenres = rawGenres
    .trim()
    .split(/([A-Z]+[a-z]+[^A-Z])/g) // split words by capital letters
    .filter((item) => item) // remove empty strings
    .map((item) => item.toLowerCase())
    .join(" ")
    .replace(/\s+\s/g, "-") // make words that are meant to be together easier to distinguish
    .split(" ")
    .map((item) => item.replace("-", " "));

  return {
    isbn,
    title: parsedBookSchema.name,
    author,
    goodreadsUrl: bookUrl,
    pages: `${parsedBookSchema.numberOfPages}`,
    genre: formattedGenres.slice(0, 3),
    coverUrl: parsedBookSchema.image,
  };
}
