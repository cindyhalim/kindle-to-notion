import { motion } from "framer-motion";
import React, { useState } from "react";
import { Box, Text } from "rebass";

import { theme } from "../layout/theme";

interface ICardProps {
  idx: number;
  onClick: () => void;
  icon: string;
  description: string;
  text: string;
}

export const Card: React.FC<ICardProps> = ({
  idx,
  onClick,
  icon,
  description,
  text,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      id={`id_${idx}`}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 1.2 }}
      initial={{ scale: 0.9 }}
    >
      <Box
        sx={{
          border: `4px solid ${theme.colors.black}`,
          borderRadius: 10,
          width: ["200px", "280px", "180px", "200px"],
          height: ["150px", "180px", "280px", "300px"],
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 15,
          boxShadow: `9px 10px 0px 3px ${theme.colors.black};`,
          marginY: [15, 20, undefined],
          marginX: [undefined, undefined, 50],
        }}
        onClick={onClick}
      >
        <Box sx={{ display: ["none", "none", "block"] }}>
          {isHovered ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text sx={{ ...theme.title }}>{icon}</Text>
              <Text
                sx={{
                  ...theme.text,
                  textAlign: "center",
                }}
              >
                {description}
              </Text>
            </Box>
          ) : (
            <Text
              sx={{
                color: theme.colors.black,
                fontSize: [16, 16, 24],
                textAlign: "center",
              }}
            >
              {`${text} ${icon}`}
            </Text>
          )}
        </Box>
        <Box
          sx={{ display: ["flex", "flex", "none"], flexDirection: "column" }}
        >
          <Text
            sx={{
              fontSize: [16, 16, 24],
              color: theme.colors.black,
              marginBottom: ["5px", "10px"],
            }}
          >
            {`${text} ${icon}`}
          </Text>
          <Text
            sx={{
              ...theme.text,
            }}
          >
            {description}
          </Text>
        </Box>
      </Box>
    </motion.div>
  );
};
