import React from "react";
import { Button as RButton, SxStyleProp } from "rebass";

import { theme } from "../layout/theme";
import { Loading } from "./loading";

export enum ButtonTypeEnum {
  "PRIMARY" = "primary",
  "SECONDARY" = "secondary",
}

export interface IButtonProps {
  type?: ButtonTypeEnum;
  disabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  sx?: SxStyleProp;
  children: React.ReactNode;
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
    [ButtonTypeEnum.PRIMARY]: {
      backgroundColor: theme.colors.black,
      color: theme.colors.white,
    },
    [ButtonTypeEnum.SECONDARY]: {
      bg: theme.colors.white,
      color: theme.colors.black,
    },
  };

  return (
    <RButton
      disabled={isLoading || disabled}
      onClick={onClick}
      sx={{
        width: ["100%", "50%", "300px"],
        cursor: "pointer",
        "&:hover": {
          opacity: 0.6,
        },
        "&:disabled": {
          cursor: "not-allowed",
          opacity: 0.4,
        },
        marginTop: 20,
        border: `3px solid ${theme.colors.black}`,
        ...theme.text,
        ...buttonStyles[type],
        ...sx,
      }}
    >
      {isLoading ? <Loading width={50} height={25} /> : children}
    </RButton>
  );
};
