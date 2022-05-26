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
    id: "%3AAZZ";
    type: "url";
    url: string | null;
  };
  "has details": {
    id: "ReeY";
    type: "formula";
    formula: {
      type: "boolean";
      boolean: boolean;
    };
  };
  genre: {
    id: "STsA";
    type: "multi_select";
    multi_select: { id: string; name: string; color: string }[];
  };
  read: {
    id: "V%60Fq";
    type: "checkbox";
    checkbox: boolean;
  };
  "book cover": {
    id: "%5CUEL";
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
    type: "formula";
    formula: {
      type: "boolean";
      boolean: boolean;
    };
  };
  author: {
    id: "bokz";
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
    id: "drf%3E";
    type: "rich_text";
    rich_text: [];
  };
  "date finished": {
    id: "gGRt";
    type: "date";
    date: string | null;
  };
  title: {
    id: "title";
    type: "title";
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
}

export interface NotionPropertyData<T> {
  propertyType: Properties;
  propertyName: keyof T;
  data: unknown;
}

type NotionFilterOperator = "and" | "or";
export type Filter<T> = {
  propertiesMap: Record<keyof T, any>;
  operator: NotionFilterOperator;
  values: { property: keyof T; value: boolean }[];
};

export type NotionFilter<T> = {
  [key: string]: {
    property: keyof T;
    checkbox: {
      equals: boolean;
    };
  }[];
};

export type RawDatabaseQueryPageResult<T> = RawDatabaseQueryGenericResult & {
  properties: T;
};

export interface IAddClippingsToPagePayload {
  quote: string;
  info: string;
}
