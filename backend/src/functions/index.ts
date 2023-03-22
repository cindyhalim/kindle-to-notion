import type { Serverless } from "src/types/serverless";
import booksStateMachine from "./booksStateMachine";
import authenticate from "./authenticate";
import createPresignedUrl from "./createPresignedUrl";
import exportClippingsToNotion from "./exportClippingsToNotion";
import getBookDetails from ".//getBookDetails";
import getBooksWithMissingInfo from "./getBooksWithMissingInfo";
import getReadListDetails from "./getReadListDetails";
import saveBookToNotion from "./saveBookToNotion";
import sendEPubToKindle from "./sendEPubToKindle";

export const handlerFunctions: Serverless["functions"] = {
  ...booksStateMachine,
  authenticate,
  createPresignedUrl,
  exportClippingsToNotion,
  getBookDetails,
  getBooksWithMissingInfo,
  getReadListDetails,
  saveBookToNotion,
  sendEPubToKindle,
};
