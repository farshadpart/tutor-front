import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import Login from '@/src/app/Login';
import { light } from '@/src/constants/colors';
import { Messages } from '@/src/constants/messages';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';

jest.mock('@/src/hooks/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: jest.fn(),
}));

jest.mock('@/src/components/themedModal/ThemedModalContext', () => ({
    useModal: jest.fn(),
}));

jest.mock('expo-router', () => ({
    Link: ({ children }: { children: unknown }) => {
        const { Text } = require('react-native');

        return <Text>{children}</Text>;
    },
}));

const mockUseAuthStore = jest.mocked(useAuthStore);
const mockUseTheme = jest.mocked(useTheme);
const mockUseModal = jest.mocked(useModal);

describe('Login', () => {
    const logIn = jest.fn();
    const showModal = jest.fn();
    const closeModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuthStore.mockReturnValue({
            logIn,
        } as unknown as ReturnType<typeof useAuthStore>);
        mockUseTheme.mockReturnValue({
            scheme: 'light',
            theme: light,
        });
        mockUseModal.mockReturnValue({
            showModal,
            closeModal,
        });
        jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const submitLoginForm = async () => {
        const { getAllByText, getByPlaceholderText } = await render(<Login />);

        await fireEvent.changeText(getByPlaceholderText(Messages.enterYourEmail), 'learner@example.com');
        await fireEvent.changeText(getByPlaceholderText(Messages.enterYourPassword), 'secure-password');
        await fireEvent.press(getAllByText('Login')[1]);
    };

    it('logs in with the entered email and password, then dismisses the keyboard on success', async () => {
        logIn.mockResolvedValue({ isSuccess: true });

        await submitLoginForm();

        await waitFor(() => {
            expect(logIn).toHaveBeenCalledWith({
                email: 'learner@example.com',
                password: 'secure-password',
            });
        });
        expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
        expect(showModal).not.toHaveBeenCalled();
    });

    it('shows a credential failure modal when login returns a 401 error', async () => {
        logIn.mockResolvedValue({ isSuccess: false, error: '401' });

        await submitLoginForm();

        await waitFor(() => {
            expect(showModal).toHaveBeenCalledWith({
                children: expect.objectContaining({
                    props: expect.objectContaining({
                        title: Messages.loginFailed,
                        message: Messages.loginFailedPleaseCheckYourCredentialsAndTryAgain,
                        onAct: closeModal,
                    }),
                }),
            });
        });
        expect(Keyboard.dismiss).not.toHaveBeenCalled();
    });

    it('shows a generic failure modal when login fails without a 500 error', async () => {
        logIn.mockResolvedValue({ isSuccess: false, error: '500' });

        await submitLoginForm();

        await waitFor(() => {
            expect(showModal).toHaveBeenCalledWith({
                children: expect.objectContaining({
                    props: expect.objectContaining({
                        title: Messages.loginFailed,
                        message: Messages.somethingWentWrongPleaseTryLater,
                        onAct: closeModal,
                    }),
                }),
            });
        });
        expect(Keyboard.dismiss).not.toHaveBeenCalled();
    });
});
