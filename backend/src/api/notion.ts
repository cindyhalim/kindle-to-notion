import { Client } from "@notionhq/client";
import {} from "@notionhq/client/build/src/api-endpoints";

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
      id: page.id,
      title: page?.properties?.title?.title?.[0]?.plain_text ?? "",
      author: page?.properties?.author?.rich_text?.[0]?.plain_text ?? "",
      missingLink: !page?.properties?.["has epub link"]?.formula?.boolean,
      missingDetails: !page?.properties?.["has details"]?.formula?.boolean,
    }));

    const formattedBooksWithMissingFields = booksWithMissingFields.reduce(
      (prev, curr) => {
        if (curr.title && curr.author) {
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
};
