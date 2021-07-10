import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Box, Text } from "rebass";

interface IErrorToastProps {
  isVisible: boolean;
}
export const ErrorToast: React.FC<IErrorToastProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layout
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: {
              opacity: 1,
              height: "auto",
              transition: { duration: 0.3 },
            },
            collapsed: { opacity: 0, height: 0 },
          }}
        >
          <Box
            sx={{
              minHeight: "50px",
              width: "100%",
              marginBottom: 30,
              padding: 10,
              borderLeft: "5px solid #fc4747",
              bg: "#ffe3e3",
              borderRadius: 5,
            }}
          >
            <Text>Something went wrong. Please try again</Text>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
