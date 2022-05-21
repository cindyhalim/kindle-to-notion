import * as env from "env-var";

export const config = {
  notionClientId: env.get("REACT_APP_NOTION_CLIENT_ID").required().asString(),
  serviceUrl: env.get("REACT_APP_SERVICE_URL").required().asString(),
};
