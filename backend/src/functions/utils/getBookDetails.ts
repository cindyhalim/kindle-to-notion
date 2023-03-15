import * as cheerio from "cheerio";
import fetch from "node-fetch";

type BookSchemaJsonLd = {
  "@context": "https://schema.org";
  "@type": "Book";
  name: string;
  image: string;
  numberOfPages: number;
  isbn: string;
  inLanguage: "English";
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
  genres: string[];
  coverUrl: string;
};

function formatBookTitle(rawTitle: string) {
  return rawTitle.replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

export default async function getBookDetails(
  isbn: string
): Promise<BookDetails> {
  let content = null;
  const bookSearchUrl = `https://www.goodreads.com/search/?q=${isbn}`;

  console.log(`Fetching XML for ISBN: ${isbn}`);
  try {
    content = await fetch(bookSearchUrl).then((response) => response.text());
  } catch {
    throw Error("Error retrieving URL content");
  }

  const $ = cheerio.load(content);
  const head = $("head");

  const bookUrl = head.find('link[rel="canonical"]').attr("href");
  console.log(`Book url found: ${bookUrl}`);

  console.log("Retrieving book schema...");
  const jsonLdTags = [];
  head.find('script[type="application/ld+json"]').each((_, jsonLdTag) => {
    jsonLdTag.children.forEach((el) => {
      jsonLdTags.push((el as any).data);
    });
  });

  const bookSchema = jsonLdTags.find((jsonLdTag) => {
    const parsed: BookSchemaJsonLd = JSON.parse(jsonLdTag);
    return parsed["@context"] === "https://schema.org";
  });

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
    title: formatBookTitle(parsedBookSchema.name),
    author,
    goodreadsUrl: bookUrl,
    pages: parsedBookSchema.numberOfPages
      ? `${parsedBookSchema.numberOfPages}`
      : null,
    genres: formattedGenres.slice(0, 3),
    coverUrl: parsedBookSchema.image,
  };
}
