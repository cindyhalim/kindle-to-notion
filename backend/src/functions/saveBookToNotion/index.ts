import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "put",
        path: "/read-list/{databaseId}/book",
        cors: true,
        request: {
          parameters: {
            paths: {
              databaseId: true,
            },
          },
        },
      },
    },
  ],
};
