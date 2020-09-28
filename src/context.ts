import { createContext } from "react";
import { fetch } from "./tools";

export const context = createContext({ fetch: fetch });
