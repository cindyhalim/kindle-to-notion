import { Client } from "@notionhq/client";
import { PagesCreateParameters } from "@notionhq/client/build/src/api-endpoints";
import {
  BulletedListItemBlock,
  RichTextPropertyValue,
  RichTextTextInput,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { config } from "../environment";

const client = new Client({ auth: config.notionToken });

const getPages = async (params: { databaseId: string }) => {
  const { databaseId } = params;
  try {
    const response = await client.databases.query({ database_id: databaseId });
    const pages = response?.results;
    if (!pages) {
      console.log("No pages retrieved from Notion API");
      return [];
    }

    const formattedPageList = pages.map((page) => ({
      id: page.id,
      title:
        (
          (page.properties?.Name as TitlePropertyValue)
            ?.title[0] as RichTextTextInput
        ).text?.content ?? "",
      author:
        (
          (page.properties?.Author as RichTextPropertyValue)
            ?.rich_text[0] as RichTextTextInput
        )?.text?.content ?? "",
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
    const body: PagesCreateParameters = {
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

  const bulletedListItemBlocks: BulletedListItemBlock[] = payload.map(
    (item) => {
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
    }
  );

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
};
