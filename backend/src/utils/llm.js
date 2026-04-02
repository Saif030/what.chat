import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// const getResponse = async (textContent) => {
//   const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ FIXED
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "nvidia/nemotron-3-nano-30b-a3b:free", // ✅ FIXED
//       messages: [
//         {
//           role: "user",
//           content: textContent,
//         },
//       ],
//       // stream: true,
//     }),
//   });

//   const data = await res.json(); // ✅ IMPORTANT
//   return data;
// };

// export default getResponse;

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

 const getResponse = async (prompt,model) => {
  const completion = await openai.chat.completions.create({
    model: model || "moonshotai/kimi-k2-instruct",
    messages: [{"role":"user","content":prompt}],
    temperature: 1,
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