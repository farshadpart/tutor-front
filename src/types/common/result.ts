export interface Result<T = void> {
    isSuccess: boolean;
    data?: T;
    error?: string;
}