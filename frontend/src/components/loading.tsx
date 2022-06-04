import React from "react";
import loadingLightAnimationData from "../assets/loading.json";
import loadingDarkAnimationData from "../assets/loading-dark.json";
import { Lottie } from "./lottie";

export const Loading: React.FC<{
  isDark?: boolean;
  width?: number;
  height?: number;
}> = ({ isDark = false, width, height }) => (
  <Lottie
    width={width}
    height={height}
    loop
    animationData={
      isDark ? loadingDarkAnimationData : loadingLightAnimationData
    }
  />
);
