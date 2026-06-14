export async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = 30000
): Promise<Response> {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    }
    catch (e) {
        if (isAbortError(e)) {
            const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
            timeoutError.cause = e;
            throw timeoutError;
        }

        throw e;
    }
    finally {
        clearTimeout(timeout);
    }
}

const isAbortError = (error: unknown): boolean => {
    return error instanceof Error && error.name === "AbortError";
}
