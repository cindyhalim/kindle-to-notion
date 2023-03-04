import { Client } from "@notionhq/client";
import type {
  GetDatabaseResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { READING_LIST_PROPERTIES } from "./constants";
import {
  type IAddClippingsToPagePayload,
  type NotionPropertyData,
  Properties,
  type RawDatabaseQueryPageResult,
} from "./types";

export default class Notion {
  protected client: Client;
  public readListDatabaseTitle: string;

  constructor({ accessToken }: { accessToken: string }) {
    this.client = new Client({ auth: accessToken });
    this.readListDatabaseTitle = "read list";
  }

  public getDatabaseIds = async (
    databaseName: string
  ): Promise<{ id: string; pageId: string }[] | null> => {
    const database = await this.client.search({
      query: databaseName,
    });

    return database.results.map((result) => ({
      id: result.id,
      pageId: result["parent"].page_id,
    }));
  };

  public getDatabaseInfo = async (
    databaseId: string
  ): Promise<GetDatabaseResponse> => {
    return await this.client.databases.retrieve({
      database_id: databaseId,
    });
  };

  public getPageInfo = async (
    pageId: string
  ): Promise<{
    archived: boolean;
    name: string;
    emoji: string | null;
    url: string;
  }> => {
    const page = await this.client.pages.retrieve({ page_id: pageId });

    return {
      archived: page["archived"],
      name: page["properties"]["title"]["title"][0].plain_text,
      emoji: page["icon"].type === "emoji" ? page["icon"].emoji : null,
      url: page["url"],
    };
  };

  public addPageToReadListDatabase = async <T>(params: {
    databaseId: string;
    properties: {
      name: keyof T;
      value: string | number | string[];
    }[];
  }) => {
    const propertiesMap = READING_LIST_PROPERTIES as Record<keyof T, any>;
    const { databaseId, properties } = params;

    try {
      const propertiesBody = properties.reduce((prev, curr) => {
        const propertyType = propertiesMap[curr.name].type;
        const content = this._formatToNotionPropeties(propertyType, curr.value);

        if (content) {
          return {
            ...prev,
            [curr.name]: content,
          };
        }
        return { ...prev };
      }, {});

      const body = {
        parent: {
          database_id: databaseId,
        },
        properties: propertiesBody,
      };

      const response = await this.client.pages.create(body);
      return { id: response.id };
    } catch (e) {
      throw e;
    }
  };

  public getPages = async <T extends unknown>({
    databaseId,
    filter,
  }: {
    databaseId: string;
    filter: QueryDatabaseParameters["filter"];
  }): Promise<{
    pages: RawDatabaseQueryPageResult<T>[];
  }> => {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        ...filter,
      });
      const pages = response?.results as RawDatabaseQueryPageResult<T>[];

      if (!pages) {
        console.log("No pages retrieved from Notion API");
        return { pages: [] };
      }

      return { pages };
    } catch (e) {
      console.log("Error retrieving pages");
      throw e;
    }
  };

  public updatePageProperties = async <T>({
    pageId,
    properties,
  }: {
    pageId: string;
    properties: NotionPropertyData<T>[];
  }) => {
    if (!properties.length) {
      console.log("Nothing to update, returning early...");
      return;
    }

    const propertiesMap = READING_LIST_PROPERTIES as Record<keyof T, any>;
    const formattedProperties = properties.reduce((prev, { name, value }) => {
      const propertyType = propertiesMap[name].type;

      return {
        ...prev,
        [name]: this._formatToNotionPropeties(propertyType, value),
      };
    }, {});

    const response = await this.client.pages.update({
      page_id: pageId,
      properties: formattedProperties,
    });

    return { id: response.id };
  };

  public appendClippingsToPage = async (params: {
    pageId: string;
    payload: IAddClippingsToPagePayload[];
  }) => {
    const { payload, pageId } = params;

    const bulletedListItemBlocks: any = payload.map((item) => {
      return {
        object: "block",
        has_children: false,
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: item.quote },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: item.quote,
            },
            {
              type: "text",
              text: { content: ` - ${item.info}` },
              annotations: {
                bold: false,
                italic: true,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: ` - ${item.info}`,
            },
          ],
        },
      };
    });

    try {
      return await this.client.blocks.children.append({
        block_id: pageId,
        children: bulletedListItemBlocks,
      });
    } catch (e) {
      console.log(`Error appending to page ${pageId}`);
      throw e;
    }
  };

  private _formatToNotionPropeties = (type: Properties, data: any) => {
    const formatMultiSelect = (items: string[]) => {
      return items.map((item) => ({
        name: item,
      }));
    };

    switch (type) {
      case Properties.TITLE:
        return {
          [Properties.TITLE]: [
            {
              type: "text",
              text: {
                content: data,
              },
            },
          ],
        };
      case Properties.RICH_TEXT:
        return {
          [Properties.RICH_TEXT]: [
            {
              type: "text",
              text: {
                content: data,
              },
            },
          ],
        };
      case Properties.MULTI_SELECT:
        return {
          [Properties.MULTI_SELECT]: formatMultiSelect(data),
        };
      case Properties.FILES:
        return {
          [Properties.FILES]: [
            {
              type: "external",
              name: data.slice(0, 100),
              external: {
                url: data,
              },
            },
          ],
        };
      case Properties.URL:
        return {
          [Properties.URL]: data,
        };
      case Properties.NUMBER:
        return {
          [Properties.NUMBER]: data,
        };
      default:
        return null;
    }
  };
}
