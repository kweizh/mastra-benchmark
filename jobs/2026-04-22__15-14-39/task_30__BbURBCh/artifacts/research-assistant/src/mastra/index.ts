import { Mastra } from "@mastra/core";
import { LibSQLVector } from "@mastra/libsql";
import { researchAgent } from "./agents/researchAgent.js";

export const libSqlVector = new LibSQLVector({
  id: "libSqlVector",
  url: "file:/home/user/research-assistant/vector.db",
});

export const mastra = new Mastra({
  agents: {
    researchAgent,
  },
  vectors: {
    libSqlVector,
  },
});
