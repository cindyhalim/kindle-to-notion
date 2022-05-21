import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "rebass";
import { Button } from "../components/button";
import { useAuth } from "../core/auth/hooks";
import { getNotionAuthorizationUrl } from "../core/auth/utils";
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
}

const AuthenticatedHomeContent = () => {
  const navigate = useNavigate();

  const features: IFeatures[] = [
    {
      text: "> scrape reading list",
      route: "/prettify",
    },
    {
      text: "> epub to kindle",
      route: "/epub-to-kindle",
    },
    {
      text: "> upload kindle clippings to notion",
      route: "/clippings-to-notion",
    },
  ];

  return (
    <>
      <Text sx={{ ...theme.title, color: theme.colors.black, fontSize: 40 }}>
        {"notion <> kindle"}
      </Text>
      {features.map((feature, idx) => (
        <Text
          key={idx}
          sx={{
            ...theme.title,
            color: theme.colors.black,
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => navigate(feature.route)}
        >
          {feature.text}
        </Text>
      ))}
    </>
  );
};

export const Home = () => {
  const { isAuthenticated } = useAuth();

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
