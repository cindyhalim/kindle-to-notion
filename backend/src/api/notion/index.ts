import { Client } from "@notionhq/client";
import {
  Filter,
  IAddClippingsToPagePayload,
  NotionFilter,
  NotionPropertyData,
  Properties,
  RawDatabaseQueryPageResult,
} from "./types";

export default class Notion {
  protected client: Client;

  constructor({ accessToken }: { accessToken: string }) {
    this.client = new Client({ auth: accessToken });
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

  public addPage = async <T>(params: {
    databaseId: string;
    propertiesMap: Record<keyof T, any>;
    textProperties: {
      key: keyof T;
      value: string;
    }[];
  }) => {
    const { databaseId, propertiesMap, textProperties: properties } = params;

    try {
      const propertiesBody = properties.reduce((prev, curr) => {
        const propertyType = propertiesMap[curr.key].type;
        const content = this._formatToNotionPropeties(propertyType, curr.value);

        if (content) {
          return {
            ...prev,
            [curr.key]: content,
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

  public getPages = async <T extends unknown>(params: {
    databaseId: string;
    filter: Filter<T>;
  }): Promise<{
    pages: RawDatabaseQueryPageResult<T>[];
  }> => {
    const { databaseId } = params;
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        ...(params.filter &&
          ({
            filter: this._transformFilterToNotion<T>(params.filter),
          } as Record<string, unknown>)),
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
    payload,
  }: {
    pageId: string;
    payload: NotionPropertyData<T>[];
  }) => {
    if (!payload.length) {
      console.log("Nothing to update, returning early...");
      return;
    }
    const properties = payload.reduce(
      (prev, { propertyName, propertyType, data }) => {
        return {
          ...prev,
          [propertyName]: this._formatToNotionPropeties(propertyType, data),
        };
      },
      {}
    );

    const response = await this.client.pages.update({
      page_id: pageId,
      properties,
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

  // transform CHECKBOX properties to notion filter query
  private _transformFilterToNotion = <T>({
    operator,
    values: filterValues,
    propertiesMap,
  }: Filter<T>): NotionFilter<T> => {
    const filterablePropertyTypes = ["checkbox", "formula"];
    const filterableProperties = filterValues.filter((filter) =>
      filterablePropertyTypes.includes(propertiesMap[filter.property]?.type)
    );
    if (!filterableProperties.length) {
      return null;
    }

    return {
      [operator]: filterableProperties.map((filter) => ({
        property: filter.property,
        checkbox: {
          equals: filter.value,
        },
      })),
    };
  };
}
