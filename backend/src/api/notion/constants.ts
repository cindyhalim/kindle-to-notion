import { RawReadingListProperties } from "./types";

export const READING_LIST_PROPERTIES: RawReadingListProperties = {
  "epub link": {
    id: "%3AAZZ",
    type: "url",
    url: "",
  },
  "has details": {
    id: "ReeY",
    type: "formula",
    formula: {
      type: "boolean",
      boolean: false,
    },
  },
  genre: {
    id: "STsA",
    type: "multi_select",
    multi_select: [
      {
        id: "82c3eddb-6700-46f1-911a-45787b7919e1",
        name: "fiction",
        color: "default",
      },
    ],
  },
  read: {
    id: "V%60Fq",
    type: "checkbox",
    checkbox: false,
  },
  "book cover": {
    id: "%5CUEL",
    type: "files",
    files: [
      {
        name: "",
        type: "external",
        external: {
          url: "",
        },
      },
    ],
  },
  "has epub link": {
    id: "%5Etn%40",
    type: "formula",
    formula: {
      type: "boolean",
      boolean: true,
    },
  },
  author: {
    id: "bokz",
    type: "rich_text",
    rich_text: [
      {
        type: "text",
        text: {
          content: "",
          link: null,
        },
        plain_text: "",
        href: null,
      },
    ],
  },
  pages: {
    id: "drf%3E",
    type: "rich_text",
    rich_text: [],
  },
  "date finished": {
    id: "gGRt",
    type: "date",
    date: null,
  },
  isbn: {
    id: "xEOE",
    type: "rich_text",
    rich_text: [
      {
        type: "text",
        text: {
          content: "",
          link: null,
        },
        plain_text: "",
        href: null,
      },
    ],
  },
  title: {
    id: "title",
    type: "title",
    title: [
      {
        type: "text",
        text: {
          content: "title",
          link: null,
        },
        plain_text: "title",
      },
    ],
  },
};
