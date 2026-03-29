import { Result } from '@/src/types/common/result';
import { log } from '@/src/services/logService';

export const interpret = async <T>(response: Response): Promise<Result<T>> => {
    try {
        if (response.status === 200) {
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
                const data = (await response.json()) as T;
                return { isSuccess: true, data };
            }

            return { isSuccess: true, data: (await response.text()) as T };
        }

        if (response.status === 204) {
            return { isSuccess: true };
        }

        if (response.status === 401)
            return { isSuccess: false, error: 'Your credential is expired. Please login again.' };

        if (response.status === 500)
            return { isSuccess: false, error: 'Something went wrong!' };

        return { isSuccess: false, error: response.status.toString() };
    } catch (e) {
        log("Error", 'Failed to interpret the response. Response: {@response}', [response], e);
        return { isSuccess: false, error: 'Something went wrong!' };
    }
} 