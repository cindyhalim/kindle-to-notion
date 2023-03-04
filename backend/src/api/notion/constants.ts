import { RawReadingListProperties } from "./types";

export const READING_LIST_PROPERTIES: RawReadingListProperties = {
  "epub link": {
    id: "%3AAZZ",
    name: "epub link",
    type: "url",
    url: "",
  },
  "goodreads link": {
    id: "w%3Dx%3A",
    name: "goodreads link",
    type: "url",
    url: "",
  },
  "has details": {
    id: "ReeY",
    name: "has details",
    type: "formula",
    formula: {
      type: "boolean",
      boolean: false,
    },
  },
  genres: {
    id: "STsA",
    name: "genres",
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
    name: "read",
    type: "checkbox",
    checkbox: false,
  },
  "book cover": {
    id: "%5CUEL",
    name: "book cover",
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
    name: "has epub link",
    type: "formula",
    formula: {
      type: "boolean",
      boolean: true,
    },
  },
  author: {
    id: "bokz",
    name: "author",
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
    name: "pages",
    type: "number",
    number: 0,
  },
  "date finished": {
    id: "gGRt",
    name: "date finished",
    type: "date",
    date: null,
  },
  isbn: {
    id: "xEOE",
    name: "isbn",
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
    name: "title",
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
