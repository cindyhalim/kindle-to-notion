export type GetBookInfoInput = {
  executionName: string;
  databaseId: string;
  pageId: string;
  author: string;
  title: string;
  isbn: string;
  isMissingLink: boolean;
  isMissingDetails: boolean;
  token: string;
};

export type GetBookDetailsOutput = {
  pages?: string;
  genres?: string[];
  coverUrl?: string;
  status?: string;
};

export type GetBookLinkOutput = {
  status?: string;
  ePub?: string | null;
};
