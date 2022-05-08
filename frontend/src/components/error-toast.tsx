import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Box, Text } from "rebass";

interface IErrorToastProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ErrorToast: React.FC<IErrorToastProps> = ({
  isVisible,
  setIsVisible,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        zIndex: 1,
        width: ["80%", "80%", "50%"],
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="hide"
            animate="show"
            exit="hide"
            variants={{
              show: { opacity: 1 },
              hide: { opacity: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onAnimationComplete={() =>
              setTimeout(() => setIsVisible(false), 3000)
            }
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
    </Box>
  );
};
