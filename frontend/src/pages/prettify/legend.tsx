import React from "react";
import { Flex, Text } from "rebass";
import { DetailsIcon, LinkIcon } from "../../components/icons";
import { theme } from "../../layout/theme";

export const Legend: React.FC = () => {
  const legend = [
    { icon: <LinkIcon />, text: "missing link" },
    { icon: <DetailsIcon />, text: "missing details" },
  ];

  return (
    <Flex sx={{ justifyContent: "center", marginBottom: 20 }}>
      {legend.map((item, idx) => (
        <Flex key={idx} sx={{ alignItems: "center", marginLeft: idx && 25 }}>
          {item.icon}
          <Text sx={{ fontSize: theme.text.fontSize, marginLeft: "5px" }}>
            {item.text}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};
