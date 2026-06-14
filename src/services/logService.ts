import { TUTORAPI } from "@/src/constants/addresses";
import { fetchWithTimeout } from '@/src/utilities/httpUitlities'

type LogLevel = 'Trace' | 'Debug' | 'Information' | 'Error';

export const log = (logLevel: LogLevel, message: string, parameters?: unknown[], exception?: unknown) => {
    try {
        const logRequest = {
            logLevel,
            exception: stringifyError(exception),
            message,
            arguments: parameters
        }

        void fetchWithTimeout(`${TUTORAPI}/log/log`, {
            method: "POST",
            body: JSON.stringify(logRequest),
            headers: {
                "Content-Type": "application/json"
            }
        }).catch(e => {
            console.error(e, "Failed to send the log request.")
        });
    } catch (e) {
        console.error(e, "Failed to send the log request.")
    }
}

const stringifyError = (exception: unknown) : string | null => {
    if (exception === null || exception === undefined) {
        return null;
    }

    if (exception instanceof Error) {
        return `name:${exception.name},\nmessage: ${exception.message},\ncause: ${exception.cause},\nstack: ${exception.stack}`;
    }

    return String(exception);
}
