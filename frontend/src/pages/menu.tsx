import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "rebass";
import { RoutesEnum } from "../core/router/routes";
import { theme } from "../layout/theme";
import { AnimatedLink } from "../components/animated-link";

export const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
  }, [ref]);

  return dimensions.current;
};

export const Menu = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);

  const options = [
    {
      text: "how to",
      route: RoutesEnum.HOW_TO,
    },
    { text: "terms and conditions", route: RoutesEnum.TERMS },
    { text: "privacy policy", route: RoutesEnum.PRIVACY },
  ];

  const reset = () => setShow(false);

  return (
    <>
      {show && (
        <Box
          sx={{
            backgroundColor: theme.colors.black,
            width: "100%",
            height: "100vh",
            // zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: [20, 20, 40],
              right: [20, 20, 40],
              cursor: "pointer",
            }}
            onClick={reset}
          ></Box>
          {options.map((option, idx) => (
            <AnimatedLink
              key={idx}
              onClick={() => {
                navigate(option.route);
                reset();
              }}
              sx={{ marginY: 10 }}
            >
              {option.text}
            </AnimatedLink>
          ))}
        </Box>
      )}
      <Box sx={{ position: "absolute", bottom: 20, left: 20 }}>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.3 }}>
          <Box
            sx={{
              zIndex: 2,
              width: 60,
              height: 60,
              fontSize: 30,
              borderRadius: 40,
              display: "flex",
              backgroundColor: theme.colors.black,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => setShow(!show)}
          >
            🧐
          </Box>
        </motion.div>
      </Box>
    </>
  );
};
