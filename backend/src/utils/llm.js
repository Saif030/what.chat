import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

 const getResponse = async (prompt,model) => {
  const completion = await openai.chat.completions.create({
    model: model || "mistralai/mistral-large-3-675b-instruct-2512",
    messages: [{"role":"user","content":prompt}],
    temperature: 0.6,
    top_p: 0.9,
    max_tokens: 16384,
    stream: false
  });

  return {
    choices: [{
      message: {
        content: completion.choices[0].message.content
      }
    }]
  };
}

export default getResponse;