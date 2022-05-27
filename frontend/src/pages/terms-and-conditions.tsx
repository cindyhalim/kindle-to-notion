import React from "react";
import { Text } from "rebass";
import { BaseLayout } from "../layout/base-layout";

export const TermsAndConditions = () => (
  <BaseLayout title={"terms and conditions"} buttons={[]}>
    <Text sx={{ fontWeight: 300 }}>
      {"notion <> kindle"} does not sell or monetize your personal data or
      content in any way.
      <br />
      <br />
      we are restricted to accessing the notion page you agree to select upon
      getting started.
      <br />
      <br />
      {"notion <> kindle"} utilizes google search to look for epub links and use
      the first link obtained from the result, which may come from an unknown
      source that could contain malicious content. please be advised when
      downloading content from unknown sources. {"notion <> kindle"} are not
      liable for issues that can arise from doing so.
    </Text>
  </BaseLayout>
);
