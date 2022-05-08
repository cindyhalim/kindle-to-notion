import React from "react";
import { Flex, Text } from "rebass";
import { theme } from "../layout/theme";

interface IListCardProps {
  title: string;
  subtitle: string;
  rightComponent: React.ReactElement;
  isSelected: boolean;
  onSelect: () => void;
}
export const ListCard: React.FC<IListCardProps> = ({
  isSelected,
  onSelect,
  title,
  subtitle,
  rightComponent,
}) => (
  <Flex
    onClick={onSelect}
    sx={{
      padding: 10,
      marginBottom: 10,
      backgroundColor: isSelected ? theme.colors.black : theme.colors.white,
      color: isSelected ? theme.colors.white : theme.colors.black,
      border: isSelected
        ? `3px solid ${theme.colors.black}`
        : `3px solid ${theme.colors.black}`,
      borderRadius: 5,
      cursor: "pointer",
      "&:hover": {
        opacity: 0.8,
      },
    }}
    flexDirection={"row"}
    justifyContent={"space-between"}
    alignItems={"center"}
  >
    <Flex flexDirection="column">
      <Text>{title}</Text>
      <Text sx={{ fontSize: 10 }}>{subtitle}</Text>
    </Flex>
    {rightComponent}
  </Flex>
);
