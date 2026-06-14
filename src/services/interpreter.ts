import {Result} from '@/src/types/common/result';

export const interpret = async <T>(response: Response): Promise<Result<T>> => {
    if (response.status === 200) {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            const data = (await response.json()) as T;
            return {isSuccess: true, data};
        }

        return {isSuccess: true, data: (await response.text()) as T};
    }

    if (response.status === 204) {
        return {isSuccess: true};
    }

    if (response.status === 401)
        return {isSuccess: false, error: 'Your credential is expired. Please login again.'};
    
    throw new Error(await response.text());
}