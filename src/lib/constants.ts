import { z } from "zod";
import { ModelTypes } from "./types";

export const availableModels = z.enum([
  ModelTypes.BOTH,
  ModelTypes.GEMINI,
  ModelTypes.GPT4,
]);
