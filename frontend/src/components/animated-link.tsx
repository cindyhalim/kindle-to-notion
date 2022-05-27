import { motion } from "framer-motion";
import React from "react";
import { Box, SxStyleProp, Text } from "rebass";

import { theme } from "../layout/theme";

interface IAnimatedLinkProps {
  onClick: () => void;
  sx?: SxStyleProp;
  textColor?: string;
}
export const AnimatedLink: React.FC<IAnimatedLinkProps> = ({
  onClick,
  sx,
  children,
  textColor = theme.colors.white,
}) => (
  <Box sx={{ height: "auto", color: textColor, ...sx }}>
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.3 }}>
      <Text
        sx={{
          ...theme.text,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {children}
      </Text>
    </motion.div>
  </Box>
);
