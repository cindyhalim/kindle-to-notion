import React, { useState } from "react";
import { Box, Text } from "rebass";
import {
  formatParsedClippings,
  IFormattedClipping,
  parseRawClippingData,
} from "../../utils";
import { DragAndDropZone } from "../../components/drag-and-drop-zone";
import { ListCard } from "../../components/list-card";
import { BaseLayout } from "../../layout/base-layout";
import { ButtonTypeEnum, IButtonProps } from "../../components/button";
import { theme } from "../../layout/theme";
import { useMutation } from "react-query";
import { exportClippingsToNotion } from "../../core/react-query";
import { ScrollingContentWrapper } from "../../components/scrolling-content-wrapper";
import { ErrorToast } from "../../components/error-toast";
import { Success } from "../../components/success";

export const UploadClippingsToNotion: React.FC = () => {
  const [selected, setSelected] = useState<{ [key: number]: boolean }>({});
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const [data, setData] = useState<IFormattedClipping[] | null>(null);

  const { mutate, isLoading, isSuccess } = useMutation(
    "exportClippingsToNotion",
    exportClippingsToNotion,
    {
      onError: () => setShowErrorToast(true),
    }
  );

  const noneSelected = Object.values(selected).every((item) => {
    return !item;
  });

  const handleExport = () => {
    if (data) {
      const selectedPayload = data.filter((_, idx) => selected[idx]);
      mutate(selectedPayload);
    }
  };

  const buttons: IButtonProps[] = [
    {
      onClick: () => {
        setData(null);
      },
      children: "cancel",
      type: ButtonTypeEnum.SECONDARY,
    },
    {
      disabled: noneSelected || isLoading || isSuccess,
      isLoading,
      onClick: handleExport,
      children: "export",
    },
  ];

  const handleValidation = (file: File) => {
    if (file.type !== "text/plain") return false;

    return true;
  };

  const getEmptyState = () => (
    <Box sx={{ color: theme.colors.black }}>
      <Text>1. Connect your Kindle via USB</Text>
      <Text>2. Open Kindle/documents </Text>
      <Text>3. Drag and drop MyClippings.txt here</Text>
    </Box>
  );

  return (
    <BaseLayout
      title={"kindle clippings to notion"}
      buttons={data ? buttons : []}
    >
      <ErrorToast isVisible={showErrorToast} setIsVisible={setShowErrorToast} />
      {isSuccess ? (
        <Success />
      ) : data && data.length ? (
        <ScrollingContentWrapper>
          {data.map((item, idx) => (
            <ListCard
              key={idx}
              title={item.title}
              subtitle={item.author}
              rightComponent={<Text>{item.clippings.length}</Text>}
              isSelected={selected[idx]}
              onSelect={() =>
                setSelected({
                  ...selected,
                  [idx]: !selected[idx],
                })
              }
            />
          ))}
        </ScrollingContentWrapper>
      ) : (
        <DragAndDropZone validate={handleValidation}>
          {({ loading, data: fileData }) => {
            if (!loading) {
              if (!fileData) {
                return getEmptyState();
              }

              if (fileData) {
                const reader = new FileReader();
                reader.readAsText(fileData);
                reader.onload = () => {
                  const result = reader.result;

                  if (result) {
                    const parsedClippingData = parseRawClippingData(result);
                    const formattedParsedData =
                      formatParsedClippings(parsedClippingData);

                    setData(formattedParsedData);

                    // select all items
                    const allSelected = formattedParsedData.reduce(
                      (prev, _, idx) => ({ ...prev, [idx]: true }),
                      {}
                    );
                    setSelected(allSelected);
                  }
                };
              }
            }

            return null;
          }}
        </DragAndDropZone>
      )}
    </BaseLayout>
  );
};
