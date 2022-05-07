import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Box, Flex, Text } from "rebass";
import { Button } from "../../components/button";
import { DetailsIcon, LinkIcon } from "../../components/icons";
import { ListCard } from "../../components/list-card";
import { config } from "../../environment";
import { BaseLayout } from "../../layout/base-layout";
import { theme } from "../../layout/theme";

type RawGetBooksResponse = {
  data: {
    author: string;
    id: string;
    missingDetails: boolean;
    missingLink: boolean;
    title: string;
  }[];
};

const getBooks = async () => {
  const baseUrl = config.serviceUrl;
  const databaseId = config.notionDatabaseId;
  const response: AxiosResponse<RawGetBooksResponse> = await axios.get(
    `${baseUrl}/databases/${databaseId}/books`
  );

  if (!response.data) {
    return [];
  }

  return response.data.data;
};

type SelectedData = {
  [key: string]: RawGetBooksResponse["data"][0] & { selected: boolean };
};
export const GetBooks: React.FC = () => {
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const { isLoading, error, data } = useQuery("books", getBooks);

  const noneSelected =
    selectedData &&
    Object.values(selectedData).every((item) => {
      return !item;
    });

  const handleButtonClick = ({
    allBooks,
    selectedBooks,
  }: {
    allBooks: RawGetBooksResponse["data"];
    selectedBooks: SelectedData | null;
  }) => {
    if (!selectedBooks) {
      return;
    }
    const booksToSubmit = allBooks.filter(
      (book) => selectedBooks[book.id].selected
    );

    //TODO: replace with api call
    console.log(booksToSubmit);
    return booksToSubmit;
  };

  useEffect(() => {
    if (data && data.length) {
      const dataWithSelected = data.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.id]: {
            ...curr,
            selected: true,
          },
        };
      }, {});
      setSelectedData(dataWithSelected);
    }
  }, [data]);

  if (isLoading) {
    return <>LOADING...</>;
  }

  if (error) {
    return <>Something went wrong!</>;
  }

  if (!data) {
    return <></>;
  }

  const legend = [
    { icon: <LinkIcon />, text: "missing link" },
    { icon: <DetailsIcon />, text: "missing details" },
  ];

  return (
    <BaseLayout title={"scrape reading list"}>
      <Flex
        sx={{
          maxWidth: "300px",
          margin: "0 auto",
          marginBottom: 20,
        }}
      >
        {legend.map((item, idx) => (
          <Flex key={idx} sx={{ alignItems: "center", marginLeft: idx && 25 }}>
            {item.icon}
            <Text sx={{ fontSize: 14, marginLeft: "5px" }}>{item.text}</Text>
          </Flex>
        ))}
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          minHeight: "500px",
        }}
      >
        {data &&
          selectedData &&
          data.map(({ title, author, id }) => (
            <ListCard
              key={id}
              title={title}
              subtitle={author}
              isSelected={selectedData[id].selected}
              onSelect={() =>
                setSelectedData({
                  ...selectedData,
                  [id]: {
                    ...selectedData[id],
                    selected: !selectedData[id].selected,
                  },
                })
              }
              rightComponent={
                <Box sx={{ display: "flex" }}>
                  <LinkIcon
                    color={
                      selectedData[id].selected
                        ? theme.colors.white
                        : theme.colors.black
                    }
                    sx={{ marginRight: "5px" }}
                  />
                  <DetailsIcon
                    color={
                      selectedData[id].selected
                        ? theme.colors.white
                        : theme.colors.black
                    }
                  />
                </Box>
              }
            />
          ))}
        <Button
          disabled={!!noneSelected}
          onClick={() =>
            handleButtonClick({ allBooks: data, selectedBooks: selectedData })
          }
          sx={{ alignSelf: "center" }}
        >
          Get data
        </Button>
      </Flex>
    </BaseLayout>
  );
};
