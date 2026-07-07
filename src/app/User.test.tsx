import { fireEvent, render } from '@testing-library/react-native';
import { light } from '@/src/constants/colors';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from '@/src/providers/ThemeProvider';
import User from './User';

jest.mock('@/src/hooks/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: jest.fn(),
}));

const mockUseAuthStore = jest.mocked(useAuthStore);
const mockUseTheme = jest.mocked(useTheme);

describe('User', () => {
    const logOut = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuthStore.mockReturnValue({
            logOut,
            tokenHolder: {
                accessToken: {
                    token: 'access-token',
                    expireAt: '2026-07-07T00:00:00Z',
                },
                refreshToken: {
                    token: 'refresh-token',
                    expireAt: '2026-07-07T00:00:00Z',
                },
            },
        });
        mockUseTheme.mockReturnValue({
            scheme: 'light',
            theme: light,
        });
    });

    it('calls logOut when the logout button is pressed', async () => {
        const { getByTestId } = await render(<User />);

        await fireEvent.press(getByTestId('logOutButton'));

        expect(logOut).toHaveBeenCalledTimes(1);
        expect(logOut).toHaveBeenCalledWith('refresh-token');
    });
});
