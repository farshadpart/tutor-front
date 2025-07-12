import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
import { KEY } from "./keyProvider";
const client = new OpenAI({apiKey: KEY, dangerouslyAllowBrowser: true});

export interface Chat {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const chat = async (input : Chat[]) : Promise<ChatCompletion> => {
    return await client.chat.completions.create({
        model: "gpt-4.1",
        messages: input,
        max_tokens: 1000,
        temperature: 0.7,
    });
}