import { Client } from "@notionhq/client";

import { config } from "../environment";
import { RawDatabaseQueryResponse } from "./types";

const client = new Client({ auth: config.notionToken });

export const getBooksWithMissingFields = async (params: {
  databaseId: string;
}) => {
  const { databaseId } = params;
  try {
    const response = await client.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: "has epub link",
            checkbox: {
              equals: false,
            },
          },
          {
            property: "has details",
            checkbox: {
              equals: false,
            },
          },
        ],
      },
    });

    const pages = response?.results as RawDatabaseQueryResponse["results"];

    console.log("Query successful, formatting data");

    const booksWithMissingFields = pages.map((page) => ({
      pageId: page.id,
      title: page?.properties?.title?.title?.[0]?.plain_text ?? "",
      author: page?.properties?.author?.rich_text?.[0]?.plain_text ?? "",
      missingLink: !page?.properties?.["has epub link"]?.formula?.boolean,
      missingDetails: !page?.properties?.["has details"]?.formula?.boolean,
      isbn: page?.properties?.isbn?.rich_text?.[0]?.plain_text ?? "",
    }));

    const formattedBooksWithMissingFields = booksWithMissingFields.reduce(
      (prev, curr) => {
        const requiredFields = [curr.title, curr.author, curr.isbn];
        if (requiredFields.every(Boolean)) {
          return [...prev, curr];
        }
        return prev;
      },
      []
    );

    return formattedBooksWithMissingFields;
  } catch (e) {
    console.log("Error retrieving books with missing fields", e);
  }
};

export enum Properties {
  RICH_TEXT = "rich_text",
  MULTI_SELECT = "multi_select",
  FILES = "files",
  URL = "url",
}

export interface NotionPropertyData {
  propertyType: Properties;
  propertyName: string;
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
            name: data,
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

const updatePage = async ({
  pageId,
  payload,
}: {
  pageId: string;
  payload: NotionPropertyData[];
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

const getPages = async (params: { databaseId: string }) => {
  const { databaseId } = params;
  try {
    const response = await client.databases.query({ database_id: databaseId });
    const pages = response?.results as RawDatabaseQueryResponse["results"];

    if (!pages) {
      console.log("No pages retrieved from Notion API");
      return [];
    }

    const formattedPageList = pages.map((page) => ({
      id: page.id,
      title: page?.properties?.title?.title?.[0].plain_text ?? "",
      author: page?.properties?.author?.rich_text?.[0].plain_text ?? "",
    }));

    return formattedPageList;
  } catch (e) {
    console.log("Error retrieving pages");
    throw e;
  }
};

const addPage = async (params: {
  databaseId: string;
  title: string;
  author?: string;
}) => {
  const { databaseId, title, author } = params;
  try {
    //TODO: fix this
    const body: any = {
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          type: "title",
          title: [{ type: "text", text: { content: title } }],
        },
        ...(author && {
          Author: {
            type: "rich_text",
            rich_text: [{ type: "text", text: { content: author ?? "" } }],
          },
        }),
      },
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
      object: "block",
      id: "",
      has_children: false,
      created_time: "",
      last_edited_time: "",
      type: "bulleted_list_item",
      bulleted_list_item: {
        text: [
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
  getBooksWithMissingFields,
  updatePage,
};
