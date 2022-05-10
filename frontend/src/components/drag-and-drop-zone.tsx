import React, { useState } from "react";
import { Box, BoxProps, SxStyleProp } from "rebass";

import { theme } from "../layout/theme";
import { ErrorToast } from "./error-toast";
import { UploadLoading } from "./upload-loading";

interface IDragAndDropZoneProps {
  validate: (file: File) => boolean;
  children: (props: { data: File | null }) => JSX.Element | null;
}
type TDragEvent = React.DragEvent<HTMLDivElement>;

export const DragAndDropZone: React.FC<IDragAndDropZoneProps> = ({
  validate,
  children,
}) => {
  const [data, setData] = useState<File | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const noUploadInitiated = !data && !isLoading;

  const blockDefault = (event: TDragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: TDragEvent) => {
    setIsLoading(true);
    setIsDragging(false);
    try {
      blockDefault(event);

      const file = event.dataTransfer.files[0];

      if (!validate(file)) {
        setIsLoading(false);
        throw Error;
      }

      setData(file);
    } catch (e) {
      setHasError(true);
      return;
    }
  };

  const dragAndDropProps: BoxProps = {
    onDragLeave: (event) => {
      blockDefault(event);
      setIsDragging(false);
    },
    onDragOver: (event) => {
      blockDefault(event);
      setIsDragging(true);
    },
    onDrop: handleDrop,
  };

  const onDragSx: SxStyleProp = {
    backgroundColor: theme.colors.black,
    opacity: "20%",
  };

  return (
    <>
      <ErrorToast isVisible={hasError} setIsVisible={setHasError} />
      <Box
        {...(noUploadInitiated && dragAndDropProps)}
        sx={{
          minHeight: "350px",
          width: "100%",
          border: `5px dotted ${theme.colors.black}`,
          borderRadius: "8px",
          display: noUploadInitiated ? "flex" : "block",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ...(isDragging && onDragSx),
        }}
      >
        {isLoading ? (
          <UploadLoading onLoopComplete={() => setIsLoading(false)} />
        ) : (
          children({
            data,
          })
        )}
      </Box>
    </>
  );
};
