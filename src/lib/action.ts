import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.NEXT_PUBLIC_OPEN_AI_ORG_ID,
  project: process.env.NEXT_PUBLIC_OPEN_AI_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateChatGPTResponse = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "assistant",
        content:
          "You are competing with other AI models to provide the best answers to teh questions the user inputs",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return completion.choices[0].message.content;
};
