export default {
  type: "object",
  properties: {
    isbn: { type: "string" },
    title: { type: "string" },
    author: { type: "string" },
    pages: { type: "string" },
    genres: { type: "array", items: { type: "string" } },
    coverUrl: { type: "string" },
    goodreadsUrl: { type: "string" },
  },
  required: [
    "isbn",
    "title",
    "author",
    "pages",
    "genres",
    "coverUrl",
    "goodreadsUrl",
  ],
} as const;
