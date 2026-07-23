import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import Index from '@/src/app';
import { light } from '@/src/constants/colors';
import { useTheme } from '@/src/providers/ThemeProvider';

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

const mockUseRouter = jest.mocked(useRouter);
const mockUseTheme = jest.mocked(useTheme);

describe('Index', () => {
    const push = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseRouter.mockReturnValue({
            push,
        } as unknown as ReturnType<typeof useRouter>);
        mockUseTheme.mockReturnValue({
            scheme: 'light',
            theme: light,
        });
    });

    it('redirects to the login page when the login button is pressed', async () => {
        const { getByText } = await render(<Index />);

        await act(async () => {
            await fireEvent.press(getByText('Login'));
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/Login');
        });
    });

    it('redirects to the register page when the register button is pressed', async () => {
        const { getByText } = await render(<Index />);

        await act(async () => {
            await fireEvent.press(getByText('Register'));
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/Register');
        });
    });
});
