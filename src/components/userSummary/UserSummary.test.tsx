import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { dark, light } from '@/src/constants/colors';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from '@/src/providers/ThemeProvider';
import { UserSummary } from './UserSummary';

jest.mock('@/src/hooks/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

const mockUseAuthStore = jest.mocked(useAuthStore);
const mockUseTheme = jest.mocked(useTheme);
const mockUseRouter = jest.mocked(useRouter);

describe('UserSummary', () => {
    const push = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuthStore.mockReturnValue({
            user: {
                email: 'student@example.com',
            },
        });
        mockUseTheme.mockReturnValue({
            scheme: 'light',
            theme: light,
        });

        const router: ReturnType<typeof useRouter> = {
            back: jest.fn(),
            canGoBack: jest.fn(() => false),
            push,
            navigate: jest.fn(),
            replace: jest.fn(),
            dismiss: jest.fn(),
            dismissTo: jest.fn(),
            dismissAll: jest.fn(),
            canDismiss: jest.fn(() => false),
            setParams: jest.fn(),
            reload: jest.fn(),
            prefetch: jest.fn(),
        };
        mockUseRouter.mockReturnValue(router);
    });

    it('renders the current user email and light avatar', async () => {
        const { getByTestId, getByText } = await render(<UserSummary />);

        expect(getByText('student@example.com')).toBeTruthy();
        expect(getByTestId('user-summary-avatar').props.source).toEqual(
            require('@/assets/images/avatar-light.png')
        );
    });

    it('uses the dark avatar when the dark theme is active', async () => {
        mockUseTheme.mockReturnValue({
            scheme: 'dark',
            theme: dark,
        });

        const { getByTestId } = await render(<UserSummary />);

        expect(getByTestId('user-summary-avatar').props.source).toEqual(
            require('@/assets/images/avatar-dark.png')
        );
    });

    it('navigates to the user screen when pressed', async () => {
        const { getByText } = await render(<UserSummary />);

        await fireEvent.press(getByText('student@example.com'));

        expect(push).toHaveBeenCalledWith('/User');
    });
});
