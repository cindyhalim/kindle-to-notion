import * as env from "env-var";

console.log("hii env", env.get());
export const config = {
  notionDatabaseId: env
    .get("REACT_APP_NOTION_DATABASE_ID")
    .required()
    .asString(),
  serviceUrl: env.get("REACT_APP_SERVICE_URL").required().asString(),
};
