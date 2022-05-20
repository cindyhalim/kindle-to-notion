import * as env from "env-var";

export const config = {
  name: env.get("SERVER_NAME").asString(),
  notionToken: env.get("NOTION_TOKEN").required().asString(),
  clientUrl: env.get("CLIENT_URL").required().asString(),
  kindleNotionBucketName: env
    .get("KINDLE_NOTION_BUCKET_NAME")
    .required()
    .asString(),
  mailerEmail: env.get("MAILER_EMAIL").required().asString(),
  mailerPassword: env.get("MAILER_PASSWORD").required().asString(),
};
