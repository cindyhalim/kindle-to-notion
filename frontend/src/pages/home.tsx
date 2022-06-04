import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "rebass";
import { Button, ButtonTypeEnum, IButtonProps } from "../components/button";
import { Card } from "../components/card";
import { getAuth, getNotionAuthorizationUrl } from "../core/auth/utils";
import { RoutesEnum } from "../core/router/routes";
import { theme } from "../layout/theme";

const UnauthenticatedHomeContent = () => {
  const notionAuthorizeUrl = getNotionAuthorizationUrl();
  const navigate = useNavigate();

  const buttons: IButtonProps[] = [
    {
      type: ButtonTypeEnum.SECONDARY,
      children: "how to",
      onClick: () => navigate(RoutesEnum.HOW_TO),
    },
    {
      children: "get started",
      onClick: () => {
        window.location.href = notionAuthorizeUrl;
      },
    },
  ];
  return (
    <Box sx={{ textAlign: "center" }}>
      <Text sx={{ ...theme.title, color: theme.colors.black }}>
        {"notion <> kindle"}
      </Text>
      <Text sx={{ ...theme.text, color: theme.colors.black, marginBottom: 60 }}>
        a collection of tools to improve your e-reading experience
      </Text>
      <Flex
        sx={{
          width: ["100%", "100%", "600px"],
          justifyContent: "center",
        }}
      >
        {buttons.map((buttonProps, idx) => (
          <Button
            key={idx}
            {...buttonProps}
            sx={{ ...buttonProps.sx, marginLeft: idx > 0 ? 10 : undefined }}
          />
        ))}
      </Flex>
    </Box>
  );
};

interface IFeatures {
  text: string;
  route: RoutesEnum;
  description: string;
  emoji: string;
}

const AuthenticatedHomeContent = () => {
  const navigate = useNavigate();
  const features: IFeatures[] = [
    {
      text: "prettify",
      route: RoutesEnum.PRETTIFY,
      emoji: "✨",
      description:
        "get book details, such as book cover and genre, as well as a link to download epub",
    },
    {
      text: "epub to kindle",
      route: RoutesEnum.EPUB_TO_KINDLE,
      emoji: "🚀",
      description: "send your epub file to your kindle",
    },
    {
      text: "kindle clippings to notion ",
      route: RoutesEnum.CLIPPINGS_TO_NOTION,
      emoji: "📋",
      description:
        "send your notes and highlights from your kindle to your notion reading list",
    },
  ];

  return (
    <>
      <Text sx={{ ...theme.title, color: theme.colors.black }}>
        {"notion <> kindle"}
      </Text>
      <Box
        sx={{
          display: "flex",
          width: ["100%", "100%", "90%"],
          marginY: [15, 20, 40],
          justifyContent: ["normal", "normal", "center"],
          alignItems: ["center", "center", "normal"],
          flexDirection: ["column", "column", "row"],
        }}
      >
        {features.map((feature, idx) => (
          <Card
            key={idx}
            idx={idx}
            onClick={() => {
              console.log("hii here");
              navigate(feature.route);
            }}
            text={feature.text}
            description={feature.description}
            icon={feature.emoji}
          />
        ))}
      </Box>
    </>
  );
};

export const Home = () => {
  const { isAuthenticated } = getAuth();
  return (
    <Flex
      sx={{
        backgroundColor: theme.colors.white,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: [15, 15, 20],
        position: "relative",
      }}
    >
      {!isAuthenticated ? (
        <UnauthenticatedHomeContent />
      ) : (
        <AuthenticatedHomeContent />
      )}
    </Flex>
  );
};
