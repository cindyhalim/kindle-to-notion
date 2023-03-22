export default {
  type: "object",
  properties: {
    payload: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          clippings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                quote: { type: "string" },
                info: { type: "string" },
              },
              required: ["quote", "info"],
            },
          },
        },
        required: ["title", "author", "clippings"],
      },
    },
  },
  required: ["payload"],
} as const;
