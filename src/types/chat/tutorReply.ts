import {FileContainer} from "@/src/types/common/fileContainer";

export interface TextResponse {
    response: string;
    correction?: string;
    revisedSentence?: string;
}

export interface TutorReplyResponse {
    textResponse: string,
    voiceResponse: FileContainer
}