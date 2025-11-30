import { TUTORAPI } from "@/src/constants/addresses";
import { Chat } from "@/src/types/chat/chat"

export const chat = async ({ input, accessToken }: { input: Chat[], accessToken: string | undefined }): Promise<string> => {
    if (accessToken === undefined)
        throw Error("Access Token is undefined!")

    const response = await fetch(`${TUTORAPI}/chat/write`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        }
    });

    console.log(response)
    return response.text();
}

export const transcription = async ({ url, accessToken }: { url: string, accessToken: string | undefined }) => {
    if (accessToken === undefined)
        throw Error("Access Token is undefined!")

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
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    
    return result.text();
};