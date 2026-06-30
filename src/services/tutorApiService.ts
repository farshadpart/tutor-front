import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from '@/src/services/interpreter';
import { Chat } from "@/src/types/chat/chat";
import { Result } from '@/src/types/common/result';
import { fetchWithTimeout } from '@/src/utilities/httpUitlities';
import { log } from '@/src/services/logService';
import { getValidToken } from "@/src/services/tokenService";

const serviceName = "tutorApiService";
const chatEndpoint = "/chat/write";
const transcriptionEndpoint = "/chat/speak";

export const chat = async ({ input }: { input: Chat[] }): Promise<Result<string>> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}${chatEndpoint}`, {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getValidToken()}`,
            }
        });

        return await interpret(response);
    } catch (e) {
        log("Error", 'Tutor API chat request failed. Endpoint: {endpoint}, MessageCount: {messageCount}', [
            chatEndpoint,
            input.length,
        ], e);
        return { isSuccess: false, error: "Something went wrong!" }
    }
}

export const transcription = async ({ url }: { url: string }): Promise<Result<string>> => {
    try {
        const formData = new FormData();
        formData.append("voice", {
            uri: url,
            name: "audio.m4a",
            type: "audio/m4a",
        } as any);

        const response = await fetchWithTimeout(`${TUTORAPI}${transcriptionEndpoint}`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "text/plain",
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${await getValidToken()}`,
            },
        });
    
        return await interpret<string>(response);
    } catch (e) {
        log("Error", 'Tutor API transcription request failed. Endpoint: {endpoint}, FileType: {fileType}, HasUri: {hasUri}', [
            transcriptionEndpoint,
            "audio/m4a",
            Boolean(url),
        ], e);
        return { isSuccess: false, error: "Something went wrong!" };
    }
};
