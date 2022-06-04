import lottie, { AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";

interface IParsedClipping {
  title: string;
  author: string;
  quote: string;
  info: string;
}

export interface IFormattedClipping {
  title: string;
  author: string;
  clippings: { quote: string; info: string }[];
}

export const parseRawClippingData = (data: string | null | ArrayBuffer) => {
  if (typeof data !== "string") {
    return;
  }

  const clippings: Array<string | undefined> = data.split("==========");
  const parsedClippings: IParsedClipping[] = [];

  for (const clipping of clippings) {
    if (!clipping) {
      break;
    }

    const sections = clipping
      .replace(/\r/g, "")
      .split("\n")
      .filter((i) => i);

    if (!sections.length) {
      break;
    }

    const titleMatch = clipping.match(/.*(?=\s\()/);
    const title = titleMatch?.[0] || "";
    const authorBeginIndex = sections[0].indexOf("(");
    const splicedAuthor = sections[0]
      .slice(authorBeginIndex + 1, sections[0].length - 1)
      .split(", ");
    const author = `${splicedAuthor[1]} ${splicedAuthor[0]}`;

    const location = sections[1]
      .match(/(?=- Your Highlight on ).*(?=\|)/)?.[0]
      ?.replace("- Your Highlight on ", "");

    const formattedLocation = location
      ? location[0].toUpperCase() + location.substring(1)
      : "";
    const quote = sections[2];

    parsedClippings.push({
      title,
      author,
      quote,
      info: formattedLocation,
    });
  }
  return parsedClippings;
};

export const formatParsedClippings = (
  parsedData: IParsedClipping[] | undefined
): IFormattedClipping[] => {
  if (!parsedData) {
    return [];
  }

  return parsedData.reduce(
    (prev: IFormattedClipping[], curr): IFormattedClipping[] => {
      const lastItem = prev[prev.length - 1];
      const title = curr.title;
      const author = curr.author;
      const clipping = { quote: curr.quote, info: curr.info };

      if (
        !prev.length ||
        (lastItem.title !== title && lastItem.author !== author)
      ) {
        return [...prev, { title, author, clippings: [clipping] }];
      }

      lastItem.clippings.push(clipping);
      return prev;
    },
    []
  );
};
