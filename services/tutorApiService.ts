import { TUTORAPI } from "./constants";

export interface Chat {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const chat = async (input: Chat[]): Promise<string> => {
    const response = await fetch(`${TUTORAPI}/chat/write`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
            "Content-Type": "application/json",
        }
    });

    return response.text();
}

export const transcription = async ({ url }: { url: string }) => {
    const formData = new FormData();
    formData.append("voice", {
        uri: url,
        name: "audio.m4a",
        type: "audio/m4a",
    } as any);

    const result = await fetch(`${TUTORAPI}/chat/speak`, {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "text/plain",
            "Content-Type": "multipart/form-data",
        },
    });
    console.log('result', result)
    return result.text();
};