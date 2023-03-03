import { makeResultResponse } from "../libs/apiGateway";
import type { APIGatewayProxyEvent } from "aws-lambda";
import getBookDetails from "./utils/getBookDetails";

const isbn13RegExp = new RegExp(/\d{13}/, "g");

/**
 * Check if given string is a valid ISBN-13 based on
 * {@link https://isbn-information.com/the-13-digit-isbn.html| this guide}.
 * @param possibleISBN13 string
 * @returns boolean
 */
function validateISBN13(possibleISBN13: string) {
  if (!isbn13RegExp.test(possibleISBN13)) {
    return false;
  }
  // strip all dash and spaces
  const cleanedPossibleISBN13 = possibleISBN13
    .replace("-", "")
    .replace(" ", "");

  const checkDigitIndex = cleanedPossibleISBN13.length - 1;
  const checkDigit = cleanedPossibleISBN13[checkDigitIndex];
  const restOfDigits = cleanedPossibleISBN13.slice(0, checkDigitIndex);

  // evaluate ISBN13:
  let sumOfWeights = 0;
  for (let i = 0; i < restOfDigits.length; i++) {
    const digitNum = Number(restOfDigits[i]);
    if (i % 2 === 0) {
      sumOfWeights += digitNum * 1;
    } else {
      sumOfWeights += digitNum * 3;
    }
  }
  const remainder = sumOfWeights % 10;
  const correctCheckDigit = 10 - remainder;

  return Number(checkDigit) === correctCheckDigit;
}

export const handler = async (event: APIGatewayProxyEvent) => {
  const { isbn } = event.queryStringParameters;

  if (!validateISBN13(isbn)) {
    return makeResultResponse(
      {
        message: "Invalid ISBN-13",
      },
      400
    );
  }

  try {
    const bookDetails = await getBookDetails(isbn);
    return makeResultResponse({ data: bookDetails });
  } catch (e) {
    console.log("Failed to get book details", e);
    return makeResultResponse(
      {
        message: "Failed to get book details",
      },
      400
    );
  }
};
