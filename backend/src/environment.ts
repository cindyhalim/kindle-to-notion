import * as env from 'env-var'

export const config = {
  name: env.get('SERVER_NAME').asString(),
  googleSearch: {
    apiKey: env.get('GOOGLE_SEARCH_API_KEY').required().asString(),
    customSearchEngineId: env
      .get('GOOGLE_CUSTOM_SEARCH_ENGINE_ID')
      .required()
      .asString(),
  },
  notionClientId: env.get('NOTION_CLIENT_ID').required().asString(),
  notionClientSecret: env.get('NOTION_CLIENT_SECRET').required().asString(),
  clientUrl: env.get('CLIENT_URL').required().asString(),
  readsExtension: {
    notionClientId: env.get('EXTENSION_NOTION_CLIENT_ID').required().asString(),
    notionClientSecret: env
      .get('EXTENSION_NOTION_CLIENT_SECRET')
      .required()
      .asString(),
  },
  kindleNotionBucketName: env
    .get('KINDLE_NOTION_BUCKET_NAME')
    .required()
    .asString(),
  mailerUsername: env.get('MAILER_USERNAME').required().asString(),
  mailerPassword: env.get('MAILER_PASSWORD').required().asString(),
  mailerClientId: env.get('MAILER_CLIENT_ID').required().asString(),
  mailerClientSecret: env.get('MAILER_CLIENT_SECRET').required().asString(),
  mailerRefreshToken: env.get('MAILER_REFRESH_TOKEN').required().asString(),
}
