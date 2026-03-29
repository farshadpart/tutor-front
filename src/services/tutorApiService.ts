import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from '@/src/services/interpreter';
import { Chat } from "@/src/types/chat/chat";
import { Result } from '@/src/types/common/result';
import { fetchWithTimeout } from '@/src/utilities/httpUitlities';
import { log } from '@/src/services/logService';

export const chat = async ({ input, accessToken }: { input: Chat[], accessToken: string }): Promise<Result<string>> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/chat/write`, {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        return interpret(response);
    } catch (e) {
        log("Error", 'Method chat failed.', [], e);
        return { isSuccess: false }
    }
}

export const transcription = async ({ url, accessToken }: { url: string, accessToken: string }): Promise<Result<string>> => {
    try {
        const formData = new FormData();
        formData.append("voice", {
            uri: url,
            name: "audio.m4a",
            type: "audio/m4a",
        } as any);

        const response = await fetchWithTimeout(`${TUTORAPI}/chat/speak`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "text/plain",
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
    
        return interpret<string>(response);
    } catch (e) {
        log("Error", 'Method transcription failed.', [], e);
        return { isSuccess: false };
    }
};