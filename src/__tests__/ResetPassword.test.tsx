import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import ResetPassword from '@/src/app/ResetPassword';
import { light } from '@/src/constants/colors';
import { Messages } from '@/src/constants/messages';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { forgotPassword, resetPassword } from '@/src/services/authenticationService';
import { useRouter } from 'expo-router';

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: jest.fn(),
}));

jest.mock('@/src/components/themedModal/ThemedModalContext', () => ({
    useModal: jest.fn(),
}));

jest.mock('@/src/services/authenticationService', () => ({
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
    Link: ({ children }: { children: unknown }) => {
        const { Text } = require('react-native');

        return <Text>{children}</Text>;
    },
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

const mockUseTheme = jest.mocked(useTheme);
const mockUseModal = jest.mocked(useModal);
const mockForgotPassword = jest.mocked(forgotPassword);
const mockResetPassword = jest.mocked(resetPassword);
const mockUseRouter = jest.mocked(useRouter);

describe('ResetPassword', () => {
    const showModal = jest.fn();
    const closeModal = jest.fn();
    const replace = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseTheme.mockReturnValue({
            scheme: 'light',
            theme: light,
        });
        mockUseModal.mockReturnValue({
            showModal,
            closeModal,
        });
        mockUseRouter.mockReturnValue({
            replace,
        } as unknown as ReturnType<typeof useRouter>);
        jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const requestResetEmail = async () => {
        const screen = await render(<ResetPassword />);

        await fireEvent.changeText(screen.getByPlaceholderText(Messages.enterYourEmail), ' learner@example.com ');
        await fireEvent.press(screen.getByText('Send Reset Email'));

        return screen;
    };

    const moveToTokenStep = async () => {
        mockForgotPassword.mockResolvedValue({ isSuccess: true });

        const screen = await requestResetEmail();

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter your reset token')).toBeTruthy();
        });

        return screen;
    };

    it('shows an email validation modal without requesting a reset email', async () => {
        const { getByText } = await render(<ResetPassword />);

        await fireEvent.press(getByText('Send Reset Email'));

        expect(mockForgotPassword).not.toHaveBeenCalled();
        expect(showModal).toHaveBeenCalledWith({
            children: expect.objectContaining({
                props: expect.objectContaining({
                    title: Messages.resetPasswordFailed,
                    message: Messages.pleaseEnterYourEmailAddress,
                    onAct: closeModal,
                }),
            }),
        });
        expect(Keyboard.dismiss).not.toHaveBeenCalled();
    });

    it('requests a reset email, shows confirmation, and reveals token fields on success', async () => {
        const screen = await moveToTokenStep();

        await waitFor(() => {
            expect(mockForgotPassword).toHaveBeenCalledWith({
                email: 'learner@example.com',
            });
        });
        expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
        expect(showModal).toHaveBeenCalledWith({
            children: expect.objectContaining({
                props: expect.objectContaining({
                    title: Messages.resetPasswordEmailSent,
                    message: Messages.pleaseCheckYourEmailForPasswordResetInstructions,
                    onAct: closeModal,
                }),
            }),
        });
        expect(screen.getByPlaceholderText(Messages.enterYourPassword)).toBeTruthy();
        expect(screen.getByPlaceholderText(Messages.confirmYourPassword)).toBeTruthy();
    });

    it('shows a password mismatch modal without resetting when passwords differ', async () => {
        const screen = await moveToTokenStep();

        await fireEvent.changeText(screen.getByPlaceholderText('Enter your reset token'), ' reset-token ');
        await fireEvent.changeText(screen.getByPlaceholderText(Messages.enterYourPassword), 'new-password');
        await fireEvent.changeText(screen.getByPlaceholderText(Messages.confirmYourPassword), 'different-password');
        await fireEvent.press(screen.getAllByText('Reset Password')[1]);

        expect(mockResetPassword).not.toHaveBeenCalled();
        expect(showModal).toHaveBeenLastCalledWith({
            children: expect.objectContaining({
                props: expect.objectContaining({
                    title: Messages.passwordMismatch,
                    message: Messages.passwordsDoNotMatchPleaseReenterYourPassword,
                    onAct: closeModal,
                }),
            }),
        });
        expect(replace).not.toHaveBeenCalled();
    });

    it('resets the password and navigates to login on success', async () => {
        mockResetPassword.mockResolvedValue({ isSuccess: true });
        const screen = await moveToTokenStep();

        await fireEvent.changeText(screen.getByPlaceholderText('Enter your reset token'), ' reset-token ');
        await fireEvent.changeText(screen.getByPlaceholderText(Messages.enterYourPassword), 'new-password');
        await fireEvent.changeText(screen.getByPlaceholderText(Messages.confirmYourPassword), 'new-password');
        await fireEvent.press(screen.getAllByText('Reset Password')[1]);

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith({
                email: 'learner@example.com',
                token: 'reset-token',
                newPassword: 'new-password',
            });
        });
        expect(Keyboard.dismiss).toHaveBeenCalledTimes(2);
        expect(showModal).toHaveBeenLastCalledWith({
            children: expect.objectContaining({
                props: expect.objectContaining({
                    title: Messages.passwordResetComplete,
                    message: Messages.yourPasswordHasBeenResetPleaseLoginWithYourNewPassword,
                    onAct: closeModal,
                }),
            }),
        });
        expect(replace).toHaveBeenCalledWith('/Login');
    });
});
