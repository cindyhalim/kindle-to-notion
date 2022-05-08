export interface IGetBookInfoPayload {
  executionName: string;
  databaseId: string;
  pageId: string;
  author: string;
  title: string;
  isbn: string;
  isMissingLink: boolean;
  isMissingDetails: boolean;
}

export interface IGetBookDetailsOutput {
  pages?: string;
  genre?: string[];
  coverUrl?: string;
  status?: string;
}

export interface IGetBookLinkOutput {
  status?: string;
  ePub?: string | null;
}
