import React, { useEffect, useState } from "react";
import { Box, BoxProps, Flex, SxStyleProp, Text } from "rebass";

import {
  formatParsedClippings,
  IFormattedClipping,
  parseRawClippingData,
} from "../utils";
import { UploadLoading } from "./upload-loading";

interface IProps {
  reset: boolean;
  defaultAction: (data: IFormattedClipping[]) => void;
  onError: () => void;
  children: (props: {
    loading: boolean;
    data: IFormattedClipping[];
  }) => JSX.Element | undefined;
}
export const DragAndDropZone: React.FC<IProps> = ({
  children,
  reset,
  defaultAction,
  onError,
}) => {
  const [data, setData] = useState<IFormattedClipping[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  type TDragEvent = React.DragEvent<HTMLDivElement>;

  useEffect(() => {
    if (reset) {
      setData([]);
    }
  }, [reset]);

  const resetDefault = (event: TDragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const noUploadInitiated = !data.length && !isLoading;

  const handleDrop = (event: TDragEvent) => {
    setIsLoading(true);
    setIsDragging(false);
    try {
      resetDefault(event);

      const file = event.dataTransfer.files[0];

      if (file.type !== "text/plain") {
        setIsLoading(false);
        throw Error;
      }

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const result = reader.result;

        if (result) {
          const parsedClippingData = parseRawClippingData(result);
          const formattedParsedData = formatParsedClippings(parsedClippingData);

          setData(formattedParsedData);
          defaultAction(formattedParsedData);
        }
      };
    } catch (e) {
      onError();
      return;
    }
  };

  const onDragSx: SxStyleProp = {
    border: "5px dotted grey",
    backgroundColor: "grey",
    opacity: "20%",
  };

  if (isLoading) {
    return <UploadLoading onLoopComplete={() => setIsLoading(false)} />;
  }

  const dragAndDropProps: BoxProps = {
    onDragLeave: (event) => {
      resetDefault(event);
      setIsDragging(false);
    },
    onDragOver: (event) => {
      resetDefault(event);
      setIsDragging(true);
    },
    onDrop: handleDrop,
  };

  return (
    <Box
      {...(noUploadInitiated && dragAndDropProps)}
      sx={{
        minHeight: "350px",
        width: "100%",
        border: data.length ? undefined : "5px dotted black",
        borderRadius: "8px",
        display: noUploadInitiated ? "flex" : "block",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...(isDragging && onDragSx),
      }}
    >
      {noUploadInitiated ? (
        <>
          <Text>1. Connect your Kindle via USB</Text>
          <Text>2. Open Kindle/documents </Text>
          <Text>3. Drag and drop MyClippings.txt here</Text>
        </>
      ) : (
        children({
          loading: isLoading,
          data,
        })
      )}
    </Box>
  );
};
