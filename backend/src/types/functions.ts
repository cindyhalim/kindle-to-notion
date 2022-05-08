export interface IGetBookInfoPayload {
  executionName: string;
  databaseId: string;
  pageId: string;
  author: string;
  title: string;
  isbn: string;
}

export interface IGetBookDetailsOutput {
  pages?: string;
  genre?: string[];
  coverUrl?: string;
  error?: string;
}

export interface IGetBookLinkOutput {
  error?: string;
  ePub?: string | null;
}
