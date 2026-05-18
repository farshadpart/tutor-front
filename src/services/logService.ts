import { TUTORAPI } from "@/src/constants/addresses";
import { fetchWithTimeout } from '@/src/utilities/httpUitlities'

export const log = (logLevel: 'Trace' | 'Debug' | 'Information' | 'Error', message: string, parameters?: object|undefined[], exception?: any) => {
    try {
        const logRequest = {
            logLevel,
            exception: stringfyError(exception),
            message,
            arguments: parameters
        }
        
        fetchWithTimeout(`${TUTORAPI}/log/log`, {
            method: "POST",
            body: JSON.stringify(logRequest),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        console.error(e, "Failed to send the log request.")
    }
}

const stringfyError = (exception: any) : string | null => {
    if (exception === null || exception === undefined) {
        return null;
    }

    if (exception instanceof Error) {
        return `name:${exception.name},\nmessage: ${exception.message},\ncause: ${exception.cause},\nstack: ${exception.stack}`;
    }

    return exception.toString();
}