export default {
  type: "object",
  properties: {
    books: {
      type: "array",
      items: {
        type: "object",
        properties: {
          isbn: { type: "string" },
          author: { type: "string" },
          pageId: { type: "string" },
          title: { type: "string" },
          isMissingDetails: { type: "boolean" },
          isMissingLink: { type: "boolean" },
        },
        required: [
          "isbn",
          "author",
          "pageId",
          "title",
          "isMissingDetails",
          "isMissingLink",
        ],
      },
    },
  },
  required: ["books"],
} as const;
