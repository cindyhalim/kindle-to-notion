import React from "react";
import { Flex } from "rebass";
import Lottie from "react-lottie";
import animationData from "../assets/upload-loading-animation.json";

export const Loading: React.FC<{
  onLoopComplete: () => void;
}> = ({ onLoopComplete }) => (
  <Flex justifyContent="center" alignItems="center" minHeight="350px">
    <Lottie
      width={250}
      height={250}
      options={{
        autoplay: true,

        animationData: animationData,
      }}
      eventListeners={[
        {
          eventName: "loopComplete",
          callback: onLoopComplete,
        },
      ]}
    />
  </Flex>
);
