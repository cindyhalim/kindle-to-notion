import React from "react";
import { Text } from "rebass";

export const Success: React.FC = () => (
  <>
    <Text sx={{ fontSize: 20, marginBottom: 40 }}>{"success! 🍾"}</Text>
    <Text sx={{ fontSize: [12, 14] }}>
      {"note: it may take some time for the updates to be reflected on notion"}
    </Text>
  </>
);
