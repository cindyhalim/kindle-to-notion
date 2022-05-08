import React from "react";
import Lottie from "react-lottie";
import loadingLightAnimationData from "../assets/loading.json";
import loadingDarkAnimationData from "../assets/loading-dark.json";

export const Loading: React.FC<{
  isDark?: boolean;
  width?: number;
  height?: number;
}> = ({ isDark = false, width, height }) => (
  <Lottie
    width={width}
    height={height}
    options={{
      autoplay: true,
      loop: true,
      animationData: isDark
        ? loadingDarkAnimationData
        : loadingLightAnimationData,
    }}
  />
);
