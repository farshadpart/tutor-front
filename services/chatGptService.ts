import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
const apiKey = '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';
const client = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

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