export type RawGetBooksResponse = {
  data: {
    author: string;
    pageId: string;
    isMissingDetails: boolean;
    isMissingLink: boolean;
    title: string;
    isbn: string;
  }[];
};

export type RawCreateUploadUrlResponse = {
  url: string;
};
