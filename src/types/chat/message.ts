export interface Message {
    id: string;
    text: string;
    reply: boolean,
    audioUrl?: string,
    error?: boolean
}