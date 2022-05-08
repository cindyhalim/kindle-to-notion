import React, { useEffect, useState } from "react";
import { isError, useMutation, useQuery } from "react-query";
import { Box, Text } from "rebass";
import { ButtonTypeEnum, IButtonProps } from "../../components/button";
import { ErrorToast } from "../../components/error-toast";
import { DetailsIcon, LinkIcon } from "../../components/icons";
import { ListCard } from "../../components/list-card";
import {
  getBooks,
  RawGetBooksResponse,
  updateBooks,
} from "../../core/react-query";
import { BaseLayout } from "../../layout/base-layout";
import { theme } from "../../layout/theme";
import { Legend } from "./legend";

type SelectedData = {
  [key: string]: RawGetBooksResponse["data"][0] & { selected: boolean };
};

export const GetBooksInfo: React.FC = () => {
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { isLoading, isFetching, error, data, refetch } = useQuery(
    "getBooks",
    getBooks,
    {
      staleTime: Infinity,
    }
  );

  const { mutate, isLoading: isUpdatingBooks } = useMutation(
    "updateBooks",
    updateBooks,
    {
      onError: () => {
        setShowErrorToast(true);
      },
      onSuccess: () => {
        setSuccess(true);
      },
    }
  );
  const noneSelected =
    selectedData &&
    Object.keys(selectedData).every((key) => !selectedData[key].selected);

  const isEmpty = data && !data.length;

  const buttons: IButtonProps[] = [
    {
      disabled: isUpdatingBooks,
      onClick: () => {},
      type: ButtonTypeEnum.SECONDARY,
      children: "home",
    },
    {
      disabled: !!noneSelected || isUpdatingBooks || success,
      isLoading: isFetching,
      onClick: () => {
        if (data) {
          handleButtonClick({ allBooks: data, selectedBooks: selectedData });
        }
      },
      sx: { alignSelf: "center" },
      children: "go",
    },
  ];

  useEffect(() => {
    if (data && data.length) {
      const dataWithSelected = data.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.pageId]: {
            ...curr,
            selected: true,
          },
        };
      }, {});
      setSelectedData(dataWithSelected);
    }
  }, [data]);

  const handleButtonClick = ({
    allBooks,
    selectedBooks,
  }: {
    allBooks: RawGetBooksResponse["data"];
    selectedBooks: SelectedData | null;
  }) => {
    if (showErrorToast) {
      setShowErrorToast(false);
    }
    if (!selectedBooks) {
      return;
    }
    const booksToSubmit = allBooks.filter(
      (book) => selectedBooks[book.pageId].selected
    );

    mutate({ books: booksToSubmit });
  };

  const getEmptyState = () => (
    <>
      <Text sx={{ fontSize: 20, marginBottom: 40 }}>
        {"you've added all your books! 🎉"}
      </Text>
      <Text sx={{ fontSize: [12, 14] }}>
        {"should be seeing your reading list?"}
      </Text>
      <Text sx={{ fontSize: [12, 14] }}>
        {"make sure your isbn, title, and author fields are populated"}
      </Text>
    </>
  );

  const getSuccessState = () => (
    <>
      <Text sx={{ fontSize: 20, marginBottom: 40 }}>{"success! 🍾"}</Text>
      <Text sx={{ fontSize: [12, 14] }}>
        {
          "note: it may take some time for the updates to be reflected on notion"
        }
      </Text>
    </>
  );

  return (
    <BaseLayout
      title={"✨ prettify reading list ✨"}
      buttons={buttons}
      isLoading={isLoading || isFetching}
      hasError={isError(error) || !data}
      isEmpty={isEmpty}
      refetch={refetch}
    >
      <ErrorToast isVisible={showErrorToast} setIsVisible={setShowErrorToast} />
      {success ? (
        getSuccessState()
      ) : (
        <>
          {isEmpty && getEmptyState()}
          {data && data.length && selectedData ? (
            <>
              <Legend />
              <Box
                sx={{
                  maxHeight: "450px",
                  overflowY: "auto",
                  padding: 20,
                  width: "100%",
                }}
              >
                {data.map(
                  (
                    {
                      title,
                      author,
                      pageId: id,
                      isMissingDetails,
                      isMissingLink,
                    },
                    idx
                  ) => {
                    const iconColor = selectedData[id].selected
                      ? theme.colors.white
                      : theme.colors.black;
                    return (
                      <ListCard
                        key={idx}
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
                            {isMissingLink && (
                              <LinkIcon
                                color={iconColor}
                                sx={{ marginRight: "5px" }}
                              />
                            )}
                            {isMissingDetails && (
                              <DetailsIcon color={iconColor} />
                            )}
                          </Box>
                        }
                      />
                    );
                  }
                )}
              </Box>
            </>
          ) : null}
        </>
      )}
    </BaseLayout>
  );
};
