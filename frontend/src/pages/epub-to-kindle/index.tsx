import React, { useState } from "react";
import { Text } from "rebass";
import { ButtonTypeEnum, IButtonProps } from "../../components/button";

import { DragAndDropZone } from "../../components/drag-and-drop-zone";
import { ListCard } from "../../components/list-card";
import { ScrollingContentWrapper } from "../../components/scrolling-content-wrapper";
import { BaseLayout } from "../../layout/base-layout";
import { theme } from "../../layout/theme";

const bytesToMegaBytes = (bytes: number) => bytes / 1024 ** 2;
const SIZE_LIMIT_MB = 50;

export const EPubToKindle: React.FC = () => {
  const [ePub, setEPub] = useState<File | null>(null);

  const validateFile = (file: File) => {
    if (file.type !== "application/epub+zip") {
      return false;
    }

    if (bytesToMegaBytes(file.size) > SIZE_LIMIT_MB) {
      return false;
    }

    return true;
  };

  const buttons: IButtonProps[] = [
    {
      onClick: () => {
        setEPub(null);
      },
      children: "cancel",
      type: ButtonTypeEnum.SECONDARY,
    },
    {
      disabled: false,
      // disabled: isLoading || isSuccess,
      // isLoading,
      onClick: () => {},
      children: "send to kindle",
    },
  ];

  const getEmptyState = () => (
    <Text sx={{ color: theme.colors.black }}>
      drag and drop your epub file here
    </Text>
  );

  return (
    <BaseLayout title="epub to kindle" buttons={ePub ? buttons : []}>
      {ePub ? (
        <ScrollingContentWrapper>
          <ListCard
            title={ePub.name}
            subtitle={`${bytesToMegaBytes(ePub.size).toFixed(2)} MB`}
            isSelected={true}
            onSelect={() => {}}
          />
        </ScrollingContentWrapper>
      ) : (
        <>
          {" "}
          <Text sx={{ color: theme.colors.black, marginBottom: 40 }}>
            make sure you fill in your emails in notion!
          </Text>
          <DragAndDropZone validate={validateFile}>
            {({ data: fileData }) => {
              if (!fileData) {
                return getEmptyState();
              }

              if (fileData) {
                setEPub(fileData);
              }

              return null;
            }}
          </DragAndDropZone>
        </>
      )}
    </BaseLayout>
  );
};
