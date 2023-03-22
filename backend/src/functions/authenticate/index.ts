import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "/authenticate",
        request: {
          parameters: {
            querystrings: {
              mode: false,
            },
          },
        },
        cors: true,
      },
    },
  ],
};
