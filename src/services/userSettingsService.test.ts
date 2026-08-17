import { fetchWithTimeout } from '@/src/utilities/httpUitlities';
import { update } from './userSettingsService';

jest.mock('@/src/utilities/httpUitlities', () => ({
    fetchWithTimeout: jest.fn(),
}));

jest.mock('@/src/services/tokenService', () => ({
    getValidToken: jest.fn().mockResolvedValue('access-token'),
}));

jest.mock('@/src/services/logService', () => ({
    log: jest.fn(),
}));

const mockFetchWithTimeout = jest.mocked(fetchWithTimeout);

describe('userSettingsService.update', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns success for a successful update response', async () => {
        mockFetchWithTimeout.mockResolvedValue(
            new Response(undefined, { status: 204 }),
        );

        await expect(update({ autoPlayVoice: false })).resolves.toEqual({
            isSuccess: true,
        });
    });

    it('returns failure when the API rejects the update', async () => {
        mockFetchWithTimeout.mockResolvedValue(
            new Response(undefined, { status: 401 }),
        );

        await expect(update({ autoPlayVoice: false })).resolves.toEqual({
            isSuccess: false,
            error: 'Your credential is expired. Please login again.',
        });
    });

    it('returns failure when the API returns another error status', async () => {
        mockFetchWithTimeout.mockResolvedValue(
            new Response('Unable to update settings', { status: 500 }),
        );

        await expect(update({ autoPlayVoice: false })).resolves.toEqual({
            isSuccess: false,
            error: 'Something went wrong!',
        });
    });
});
