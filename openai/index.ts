import { OpenAI } from "openai";
import { instructionPrompt } from "./prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function sendMessageToOpenAI(
  imageBase64: string
): Promise<string | null> {
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: instructionPrompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_image",
            image_url: imageBase64,
            detail: "high",
          },
        ],
      },
    ],
    tools: [
      {
        type: "image_generation",
        size: "1024x1536",
      },
    ],
  });

  const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

  return imageData[0] ?? null;
}
