import React, { useEffect, useState } from "react";
import { Box, Button, ButtonProps, Flex, Text } from "rebass";
import { BaseLayout } from "./layout/base-layout";
import { theme } from "./layout/theme";
import { IFormattedClipping } from "./utils";
import axios from "axios";
import { config } from "./environment";
import { DragAndDropZone } from "./components/drag-and-drop-zone";
import { ListCard } from "./components/list-card";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { ErrorToast } from "./components/error-toast";
import Lottie from "react-lottie";
import animationData from "./assets/loading.json";

export const App: React.FC = () => {
  const [selected, setSelected] = useState<{ [key: number]: boolean }>({});
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const noneSelected = Object.values(selected).every((item) => {
    return !item;
  });

  const getSelected = (data: IFormattedClipping[]) => {
    if (data) {
      let selectedData = {};
      data.forEach((_, idx) => {
        selectedData = { ...selectedData, [idx]: true };
      });

      setSelected(selectedData);
    }
  };

  useEffect(() => {
    if (hasError) {
      const timeOut = setTimeout(() => setHasError(false), 3000);
      return () => clearTimeout(timeOut);
    }
  }, [hasError]);

  return (
    <BaseLayout>
      <Flex flexDirection={"column"}>
        <Text sx={{ ...theme.title }}>kindle to notion</Text>
        <ErrorToast isVisible={hasError} />
        <DragAndDropZone
          reset={isCancelled}
          onError={() => {
            setHasError(true);
          }}
          defaultAction={(data) => {
            setIsCancelled(false);
            getSelected(data);
          }}
        >
          {({ loading, data }) => {
            if (data.length && !loading) {
              return (
                <Box sx={{ marginTop: 20, width: "100%" }}>
                  {data.map((item, idx) => (
                    <ListCard
                      key={idx}
                      title={item.title}
                      subtitle={item.author}
                      total={item.clippings.length}
                      isSelected={selected[idx]}
                      onSelect={() =>
                        setSelected({
                          ...selected,
                          [idx]: !selected[idx],
                        })
                      }
                    />
                  ))}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: ["column", "column", "row"],
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <Button
                      disabled={noneSelected || isLoading}
                      onClick={async () => {
                        setHasError(false);
                        setIsLoading(true);
                        try {
                          const payload = data.filter(
                            (_, idx) => selected[idx]
                          );
                          await axios.post(
                            `${config.serviceUrl}/databases/${config.notionDatabaseId}`,
                            { payload }
                          );
                        } catch (e) {
                          setIsLoading(false);
                          setHasError(true);
                        }
                      }}
                      sx={{
                        width: ["100%", "100%", "50%"],
                        backgroundColor: "black",
                        cursor: "pointer",
                        ...theme.text,
                        "&:disabled": {
                          cursor: "not-allowed",
                          opacity: 0.4,
                        },
                      }}
                    >
                      {isLoading ? (
                        <Lottie
                          width={50}
                          height={25}
                          options={{
                            autoplay: true,
                            loop: true,
                            animationData: animationData,
                          }}
                        />
                      ) : (
                        "Add to Notion"
                      )}
                    </Button>
                    <Button
                      onClick={() => setIsCancelled(true)}
                      sx={{
                        marginTop: [10, 10, 0],
                        width: ["100%", "100%", "48%"],
                        border: "3px solid black",
                        bg: "white",
                        color: "black",
                        cursor: "pointer",
                        ...theme.text,
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              );
            }
            return undefined;
          }}
        </DragAndDropZone>
      </Flex>
    </BaseLayout>
  );
};
