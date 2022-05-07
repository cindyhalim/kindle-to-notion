export type RawDatabaseQueryResponse = {
  object: "list";
  results: {
    object: "page";
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
    properties: {
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
        multi_select: [];
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
              type: "file";
              file: {
                url: string;
                expiry_time: string;
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
          plain_text: "string";
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
    url: string;
  }[];
  next_cursor: null;
  has_more: false;
  type: "page";
  page: {};
};
