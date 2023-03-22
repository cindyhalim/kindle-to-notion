export default {
  type: "object",
  properties: {
    uploadKey: { type: "string" },
  },
  required: ["uploadKey"],
} as const;
