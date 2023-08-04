export default {
  type: "object",
  properties: {
    isbn: { type: "string" },
    title: { type: "string" },
    author: { type: "string" },
    pages: { type: ["string", "null"] },
    genres: { type: "array", items: { type: "string" } },
    coverUrl: { type: "string" },
    goodreadsUrl: { type: "string" },
    ePubUrl: { type: ["string", "null"] },
  },
  required: [
    "isbn",
    "title",
    "author",
    "pages",
    "genres",
    "coverUrl",
    "goodreadsUrl",
    "ePubUrl",
  ],
} as const;
