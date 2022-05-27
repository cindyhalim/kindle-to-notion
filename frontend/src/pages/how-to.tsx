import React from "react";
import { Box, Link, Text } from "rebass";
import { BaseLayout } from "../layout/base-layout";
import { theme } from "../layout/theme";

export const HowTo = () => (
  <BaseLayout title={"how to"} buttons={[]}>
    <Box sx={{ textAlign: "left" }}>
      <Text sx={{ ...theme.heading, marginBottom: 10, marginTop: 20 }}>
        1️⃣ duplicate{" "}
        <Link
          sx={{ color: theme.colors.black }}
          target="_blank"
          href="https://cindyhalim.notion.site/reading-list-template-602f353294734d8488e862621df209f0"
        >
          the following notion template
        </Link>{" "}
        and make sure it is a root (most top-level) page!
      </Text>
      <Text sx={{ fontWeight: 300 }}>
        this makes it easier to locate the tables upon connecting to notion and
        prevents unnecessary access to your other content!
      </Text>
      <Text sx={{ ...theme.heading, marginBottom: 10, marginTop: 20 }}>
        2️⃣ some rules:
      </Text>
      <Text sx={{ fontWeight: 300 }}>
        ❌ don't delete any databases
        <br />❌ don't modify any existing database properties
        <br /> ❌ for the reading list database: don’t edit "has epub link" and
        "has details" directly (they’re hidden from plain sight for a reason!)
        <br /> ✅ feel free to add more of your own properties and/or databases
      </Text>
      <Text sx={{ ...theme.heading, marginBottom: 10, marginTop: 20 }}>
        3️⃣ enjoy :)
      </Text>
    </Box>
  </BaseLayout>
);
