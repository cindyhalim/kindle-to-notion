import React from "react";
import { Flex, Text } from "rebass";

interface IListCardProps {
  title: string;
  subtitle: string;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
}
export const ListCard: React.FC<IListCardProps> = ({
  isSelected,
  onSelect,
  title,
  subtitle,
  total,
}) => (
  <Flex
    onClick={onSelect}
    sx={{
      padding: 10,
      marginBottom: 10,
      backgroundColor: isSelected ? "black" : "white",
      color: isSelected ? "white" : "black",
      border: isSelected ? "3px solid black" : "3px solid black",
      borderRadius: 5,
      cursor: "pointer",
    }}
    flexDirection={"row"}
    justifyContent={"space-between"}
  >
    <Flex flexDirection="column">
      <Text>{title}</Text>
      <Text sx={{ fontSize: 10 }}>{subtitle}</Text>
    </Flex>
    <Text>{total}</Text>
  </Flex>
);
