import React from "react";
import Lottie from "react-lottie";
import { Button as RButton, SxStyleProp } from "rebass";

import { theme } from "../layout/theme";
import animationData from "../assets/loading.json";

export enum ButtonTypeEnum {
  "PRIMARY" = "primary",
  "SECONDARY" = "secondary",
}

interface IButtonProps {
  type?: ButtonTypeEnum;
  disabled: boolean;
  onClick: () => void;
  isLoading?: boolean;
  sx?: SxStyleProp;
}
export const Button: React.FC<IButtonProps> = ({
  type = ButtonTypeEnum.PRIMARY,
  disabled,
  onClick,
  isLoading,
  sx,
  children,
}) => {
  const buttonStyles: { [key in ButtonTypeEnum]: SxStyleProp } = {
    ["primary"]: {
      backgroundColor: theme.colors.black,
      color: theme.colors.white,
    },
    ["secondary"]: {
      border: `3px solid ${theme.colors.black}`,
      bg: theme.colors.white,
      color: theme.colors.black,
    },
  };

  return (
    <RButton
      disabled={isLoading || disabled}
      onClick={onClick}
      sx={{
        width: ["100%", "100%", "50%"],
        cursor: "pointer",
        "&:disabled": {
          cursor: "not-allowed",
          opacity: 0.4,
        },
        marginTop: 20,
        ...theme.text,
        ...buttonStyles[type],
        ...sx,
      }}
    >
      {isLoading ? (
        <Lottie
          width={50}
          height={25}
          options={{
            autoplay: true,
            loop: true,
            animationData: animationData,
          }}
        />
      ) : (
        children
      )}
    </RButton>
  );
};
