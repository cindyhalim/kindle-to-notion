import { Client } from "@notionhq/client";

import { config } from "../../environment";
import { RawDatabaseQueryGenericPageResult } from "./types";

const client = new Client({ auth: config.notionToken });

export enum Properties {
  RICH_TEXT = "rich_text",
  MULTI_SELECT = "multi_select",
  FILES = "files",
  URL = "url",
}

export interface NotionPropertyData<T> {
  propertyType: Properties;
  propertyName: keyof T;
  data: unknown;
}

const formatToNotionPropeties = (type: Properties, data: any) => {
  const formatMultiSelect = (items: string[]) => {
    return items.map((item) => ({
      name: item,
    }));
  };

  switch (type) {
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
    default:
      return null;
  }
};

const updatePageProperties = async <T>({
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
        [propertyName]: formatToNotionPropeties(propertyType, data),
      };
    },
    {}
  );

  const response = await client.pages.update({
    page_id: pageId,
    properties,
  });

  return { id: response.id };
};

type NotionFilterOperator = "and" | "or";
type Filter<T> = {
  propertiesMap: Record<keyof T, any>;
  operator: NotionFilterOperator;
  values: { property: keyof T; value: boolean }[];
};

type NotionFilter<T> = {
  [key: string]: {
    property: keyof T;
    checkbox: {
      equals: boolean;
    };
  }[];
};

// transform CHECKBOX properties to notion filter query
const transformFilterToNotion = <T>({
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

type RawDatabaseQueryPageResult<T> = RawDatabaseQueryGenericPageResult & {
  properties: T;
};

const getPages = async <T extends unknown>(params: {
  databaseId: string;
  filter?: Filter<T>;
}): Promise<{
  pages: RawDatabaseQueryPageResult<T>[];
}> => {
  const { databaseId, filter } = params;
  try {
    const filterOptions = {
      filter: transformFilterToNotion<T>(filter),
    } as Record<string, unknown>;
    const response = await client.databases.query({
      database_id: databaseId,
      ...(filter && filterOptions),
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

const addPage = async <T>(params: {
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
      const content = formatToNotionPropeties(propertyType, curr.value);

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

    const response = await client.pages.create(body);
    return { id: response.id };
  } catch (e) {
    throw e;
  }
};

export interface IAddClippingsToPagePayload {
  quote: string;
  info: string;
}

const addClippingsToPage = async (params: {
  pageId: string;
  payload: IAddClippingsToPagePayload[];
}) => {
  const { payload, pageId } = params;

  const bulletedListItemBlocks: any = payload.map((item) => {
    return {
      synced_block: "",
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
    return await client.blocks.children.append({
      block_id: pageId,
      children: bulletedListItemBlocks,
    });
  } catch (e) {
    console.log(`Error appending to page ${pageId}`);
    throw e;
  }
};

export const notion = {
  getPages,
  addPage,
  addClippingsToPage,
  updatePageProperties,
};
