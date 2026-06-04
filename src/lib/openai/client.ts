import OpenAI from "openai";

/**
 * OpenAI client. SERVER ONLY — never import into a Client Component.
 * Model is configurable via OPENAI_MODEL (defaults to a cheap, capable model).
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
