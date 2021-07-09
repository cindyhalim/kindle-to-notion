import "source-map-support/register";
import pkg from "../../package.json";
import { makeResultResponse } from "../libs/apiGateway";

export const handler = async () => {
  return makeResultResponse({ version: `${pkg.name}@${pkg.version}` });
};
