import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "rebass";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { getAuth, getNotionAuthorizationUrl } from "../core/auth/utils";
import { theme } from "../layout/theme";

const UnauthenticatedHomeContent = () => {
  const notionAuthorizeUrl = getNotionAuthorizationUrl();

  return (
    <>
      <Text sx={{ ...theme.title, color: theme.colors.black }}>
        {"notion <> kindle"}
      </Text>
      <Text sx={{ ...theme.text, color: theme.colors.black, marginBottom: 40 }}>
        a collection of tools to improve your e-reading experience
      </Text>
      <Button
        onClick={() => {
          window.location.href = notionAuthorizeUrl;
        }}
      >
        get started
      </Button>
    </>
  );
};

interface IFeatures {
  text: string;
  route: string;
  description: string;
  emoji: string;
}

const AuthenticatedHomeContent = () => {
  const navigate = useNavigate();
  const features: IFeatures[] = [
    {
      text: "prettify",
      route: "prettify",
      emoji: "✨",
      description:
        "get book details, such as book cover and genre, as well as a link to download epub",
    },
    {
      text: "epub to kindle",
      route: "epub-to-kindle",
      emoji: "🚀",
      description: "send your epub file to your kindle",
    },
    {
      text: "kindle clippings to notion ",
      route: "clippings-to-notion",
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
            onClick={() => setTimeout(() => navigate(feature.route), 200)}
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
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
