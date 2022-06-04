import React from "react";
import { Flex } from "rebass";
import animationData from "../assets/upload-loading-animation.json";
import { Lottie } from "./lottie";

export const UploadLoading: React.FC<{
  onLoopComplete: () => void;
}> = ({ onLoopComplete }) => (
  <Flex justifyContent="center" alignItems="center" minHeight="350px">
    <Lottie
      width={150}
      height={150}
      animationData={animationData}
      eventListeners={[
        {
          eventName: "loopComplete",
          callback: onLoopComplete,
        },
      ]}
    />
  </Flex>
);
