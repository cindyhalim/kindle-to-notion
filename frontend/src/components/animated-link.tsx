import { motion } from "framer-motion";
import React from "react";
import { Box, SxStyleProp, Text } from "rebass";

import { theme } from "../layout/theme";

interface IAnimatedLinkProps {
  onClick: () => void;
  sx?: SxStyleProp;
}
export const AnimatedLink: React.FC<IAnimatedLinkProps> = ({
  onClick,
  sx,
  children,
}) => (
  <Box sx={{ height: "auto", ...sx }}>
    <motion.div whileHover={{ scale: 1.5 }} whileTap={{ scale: 1.8 }}>
      <Text
        sx={{
          ...theme.text,
          color: theme.colors.black,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {children}
      </Text>
    </motion.div>
  </Box>
);
