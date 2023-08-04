import { makeResultResponse } from "../../libs/apiGateway";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { getBookDetails, getEpubLink, validateISBN13 } from "@functions/utils";

type GetBookDetailsResponse = {
  data: {
    ePubUrl: string;
    isbn: string;
    title: string;
    author: string;
    goodreadsUrl: string;
    pages: string;
    genres: string[];
    coverUrl: string;
  };
};

export const main = async (event: APIGatewayProxyEvent) => {
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
    const ePubUrl = await getEpubLink({
      title: bookDetails.title,
      author: bookDetails.author,
    });

    return makeResultResponse<GetBookDetailsResponse>({
      data: { ...bookDetails, ePubUrl },
    });
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
