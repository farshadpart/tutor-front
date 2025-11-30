export interface Message {
    id: string;
    text: string;
    reply: boolean,
    error?: boolean
}