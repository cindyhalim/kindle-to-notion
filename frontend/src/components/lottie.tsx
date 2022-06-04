import lottie, {
  AnimationEventCallback,
  AnimationEventName,
  AnimationItem,
} from "lottie-web";
import React, { useEffect, useRef } from "react";
import { Box } from "rebass";

interface ILottieProps {
  width?: number;
  height?: number;
  animationData: any;
  loop?: boolean;
  eventListeners?: {
    eventName: AnimationEventName;
    callback: AnimationEventCallback;
  }[];
}
export const Lottie: React.FC<ILottieProps> = ({
  animationData,
  loop,
  width = 30,
  height = 30,
  eventListeners,
}) => {
  const lottieInstance = useRef<AnimationItem>();
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (element.current) {
      lottieInstance.current = lottie.loadAnimation({
        animationData: animationData,
        container: element.current,
        autoplay: true,
        ...(loop && { loop }),
      });
    }
  }, [animationData, loop]);

  useEffect(() => {
    if (eventListeners?.length) {
      eventListeners.forEach((event) =>
        lottieInstance.current?.addEventListener(
          event.eventName,
          event.callback
        )
      );

      return () =>
        eventListeners?.forEach((event) =>
          lottieInstance.current?.removeEventListener(event.eventName)
        );
    }
  }, [eventListeners]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box ref={element} width={width} height={height} />
    </Box>
  );
};
