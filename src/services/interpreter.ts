import { Result } from '@/src/types/common/result';

export const interpret = async <T>(response: Response): Promise<Result<T>> => {
    try {
        if (response.status === 200) {
            const responseText = await response.text();
            if(responseText)
                return { isSuccess: true, data: JSON.parse(responseText) as T };

            return { isSuccess: true };
        }

        if (response.status === 500)
            return { isSuccess: false, error: 'Something went wrong!' };

        return { isSuccess: false, error: response.status.toString() };
    } catch (e) {
        console.error(e, `Failed to interpret response`);
        return { isSuccess: false, error: 'Something went wrong!' };
    }
} 