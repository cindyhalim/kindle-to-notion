import React, { useState, useMemo } from "react";
import { Box, Button, Flex, Text } from "rebass";
import { Input } from "@rebass/forms";
import { BaseLayout } from "./layout/base-layout";
import { theme } from "./layout/theme";
import {
  formatParsedClippings,
  IFormattedClipping,
  parseRawClippingData,
} from "./utils";
import axios from "axios";

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formattedData, setFormattedData] = useState<IFormattedClipping[]>([]);
  const [selected, setSelected] = useState<{ [key: number]: boolean }>({});

  useMemo(() => {
    if (formattedData) {
      let selectedData = {};
      formattedData.forEach((_, idx) => {
        selectedData = { ...selectedData, [idx]: true };
      });

      setSelected(selectedData);
    }
  }, [formattedData]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const input = event.target;

    if (!input || !input.files) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      const result = reader.result;

      if (result) {
        const parsedClippingData = parseRawClippingData(result);
        const formattedParsedData = formatParsedClippings(parsedClippingData);

        setFormattedData(formattedParsedData);
      }
    };
  };

  return (
    <BaseLayout>
      <Flex flexDirection={"column"}>
        <Text sx={{ ...theme.title }}>kindle to notion</Text>
        <Text>
          drag and drop your <i>My Clippings.txt</i> file
        </Text>
        <Input
          type="file"
          accept="text/plain"
          disabled={isLoading}
          sx={{
            borderRadius: "5px",
            marginTop: 10,
            padding: 15,
            ...theme.text,
          }}
          onError={(e) => console.log("hii error", e)}
          multiple={false}
          onChange={handleUpload}
        />
        <Box sx={{ marginTop: 20 }}>
          {formattedData.map((item, idx) => (
            <Flex
              key={idx}
              onClick={() => {
                setSelected({
                  ...selected,
                  [idx]: !selected[idx],
                });
              }}
              sx={{
                padding: 10,
                marginBottom: 10,
                backgroundColor: selected[idx] ? "black" : "white",
                color: selected[idx] ? "white" : "black",
                border: selected[idx] ? "2px solid black" : "2px solid black",
                borderRadius: 5,
              }}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Flex flexDirection="column">
                <Text>{item.title}</Text>
                <Text sx={{ fontSize: 10 }}>{item.author}</Text>
              </Flex>
              <Text>{item.clippings.length}</Text>
            </Flex>
          ))}
        </Box>
        <Button
          sx={{
            marginTop: 20,
            backgroundColor: "black",
            cursor: "pointer",
            ...theme.text,
          }}
          onClick={async () => {
            const payload = formattedData.filter((_, idx) => selected[idx]);
            console.log("hii payload", payload);
            await axios.post(
              "",
              { payload },
              {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Credentials": true,
                },
              }
            );
          }}
        >
          {`Add to Notion`}
        </Button>
      </Flex>
    </BaseLayout>
  );
};
