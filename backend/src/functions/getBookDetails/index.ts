import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/book",
        cors: true,
        request: {
          parameters: {
            querystrings: {
              isbn: true,
            },
          },
        },
      },
    },
  ],
};
