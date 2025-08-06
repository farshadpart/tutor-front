import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
import { KEY } from "./keyProvider";

const client = new OpenAI({ apiKey: KEY, dangerouslyAllowBrowser: true });

export interface Chat {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const chat = async (input: Chat[]): Promise<ChatCompletion> => {
    return await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: input,
        max_tokens: 1000,
        temperature: 0.7,
    });
}

export const transcription = async ({ url }: { url: string }) => {
    const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";

    let filePart;

    if (isReactNative) {
        filePart = {
            uri: url,
            name: "audio.m4a",
            type: "audio/m4a",
        } as any;
    } else {
        const response = await fetch(url);
        const blob = await response.blob();
        filePart = new File([blob], "audio.m4a", { type: "audio/m4a" });
    }

    const formData = new FormData();
    formData.append("file", filePart);
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const result = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${KEY}`,
        },
        body: formData,
    });

    const json = await result.json();
    console.log('chatGPT transcription result', json);

    return json.text;
};