export type RawDatabaseQueryGenericResult = {
  object: "database" | "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: "user";
    id: string;
  };
  last_edited_by: {
    object: "user";
    id: string;
  };
  cover: null;
  icon: null;
  parent: {
    type: "database_id";
    database_id: "string";
  };
  archived: boolean;
  url: string;
};

export type RawReadingListProperties = {
  "epub link": {
    name: "epub link";
    id: "%3AAZZ";
    type: "url";
    url: string | null;
  };
  "goodreads link": {
    id: "w%3Dx%3A";
    name: "goodreads link";
    type: "url";
    url: string | null;
  };
  "has details": {
    id: "ReeY";
    name: "has details";
    type: "formula";
    formula: {
      type: "boolean";
      boolean: boolean;
    };
  };
  genres: {
    id: "STsA";
    name: "genres";
    type: "multi_select";
    multi_select: { id: string; name: string; color: string }[];
  };
  read: {
    id: "V%60Fq";
    name: "read";
    type: "checkbox";
    checkbox: boolean;
  };
  "book cover": {
    id: "%5CUEL";
    name: "book cover";
    type: "files";
    files:
      | {
          name: string;
          type: "external";
          external: {
            url: string;
          };
        }[]
      | null;
  };
  "has epub link": {
    id: "%5Etn%40";
    name: "has epub link";
    type: "formula";
    formula: {
      type: "boolean";
      boolean: boolean;
    };
  };
  author: {
    id: "bokz";
    name: "author";
    type: "rich_text";
    rich_text: {
      type: "text";
      text: {
        content: string;
        link: string | null;
      };
      plain_text: string;
      href: null;
    }[];
  };
  isbn: {
    name: "isbn";
    id: "xEOE";
    type: "rich_text";
    rich_text: {
      type: "text";
      text: {
        content: string;
        link: string | null;
      };
      plain_text: string;
      href: null;
    }[];
  };
  pages: {
    name: "pages";
    id: "drf%3E";
    type: "number";
    number: number | null;
  };
  "date finished": {
    id: "gGRt";
    name: "date finished";
    type: "date";
    date: string | null;
  };
  title: {
    id: "title";
    type: "title";
    name: "title";
    title: {
      type: "text";
      text: {
        content: string;
        link: string | null;
      };
      plain_text: string;
    }[];
  };
};

export type RawEmailListProperties = {
  value: {
    id: "Fcgt";
    type: "rich_text";
    rich_text: {
      type: "text";
      text: {
        content: string;
        link: null;
      };
    }[];
  };
  key: {
    id: "title";
    type: "title";
    title: {
      type: "text";
      text: {
        content: string;
        link: null;
      };
      plain_text: string;
    }[];
  };
};

export enum Properties {
  RICH_TEXT = "rich_text",
  MULTI_SELECT = "multi_select",
  FILES = "files",
  URL = "url",
  TITLE = "title",
  NUMBER = "number",
}

export interface NotionPropertyData<T> {
  name: keyof T;
  value: string | number | string[];
}

export type RawDatabaseQueryPageResult<T> = RawDatabaseQueryGenericResult & {
  properties: T;
};

export interface IAddClippingsToPagePayload {
  quote: string;
  info: string;
}
