import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import Register from '@/src/app/Register';
import { light } from '@/src/constants/colors';
import { Messages } from '@/src/constants/messages';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { register } from '@/src/services/accountService';
import { useRouter } from 'expo-router';

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: jest.fn(),
}));

jest.mock('@/src/components/themedModal/ThemedModalContext', () => ({
    useModal: jest.fn(),
}));

jest.mock('@/src/services/accountService', () => ({
    register: jest.fn(),
}));

jest.mock('expo-router', () => ({
    Link: ({ children }: { children: unknown }) => {
        const { Text } = require('react-native');

        return <Text>{children}</Text>;
    },
    useRouter: jest.fn(),
}));

const mockUseTheme = jest.mocked(useTheme);
const mockUseModal = jest.mocked(useModal);
const mockRegister = jest.mocked(register);
const mockUseRouter = jest.mocked(useRouter);

describe('Register', () => {
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

    const submitRegisterForm = async (
        password = 'secure-password',
        confirmPassword = password,
    ) => {
        const { getByPlaceholderText, getByText } = await render(<Register />);

        await fireEvent.changeText(getByPlaceholderText(Messages.enterYourEmail), 'learner@example.com');
        await fireEvent.changeText(getByPlaceholderText(Messages.enterYourPassword), password);
        await fireEvent.changeText(getByPlaceholderText(Messages.confirmYourPassword), confirmPassword);
        await fireEvent.press(getByText('Register'));
    };

    it('shows a password mismatch modal without calling register when passwords differ', async () => {
        await submitRegisterForm('secure-password', 'different-password');

        expect(mockRegister).not.toHaveBeenCalled();
        expect(showModal).toHaveBeenCalledWith({
            children: expect.objectContaining({
                props: expect.objectContaining({
                    title: Messages.passwordMismatch,
                    message: Messages.passwordsDoNotMatchPleaseReenterYourPassword,
                    onAct: closeModal,
                }),
            }),
        });
        expect(Keyboard.dismiss).not.toHaveBeenCalled();
        expect(replace).not.toHaveBeenCalled();
    });

    it('registers with the entered email and password, then shows confirmation and navigates home on success', async () => {
        mockRegister.mockResolvedValue({ isSuccess: true });

        await submitRegisterForm();

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                email: 'learner@example.com',
                password: 'secure-password',
            });
        });
        expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
        expect(showModal).toHaveBeenCalledWith({
            children: expect.objectContaining({
                props: expect.objectContaining({
                    title: Messages.emailConfirmation,
                    message: Messages.pleaseCheckYourConfirmationEmailToVerifyYourAddress,
                    onAct: closeModal,
                }),
            }),
        });
        expect(replace).toHaveBeenCalledWith('/');
    });

    it('shows a registration failure modal when registration fails', async () => {
        mockRegister.mockResolvedValue({ isSuccess: false });

        await submitRegisterForm();

        await waitFor(() => {
            expect(showModal).toHaveBeenCalledWith({
                children: expect.objectContaining({
                    props: expect.objectContaining({
                        title: Messages.registrationFailed,
                        message: Messages.yourRegistrationCouldNotBeCompletedPleaseTryLater,
                        onAct: closeModal,
                    }),
                }),
            });
        });
        expect(Keyboard.dismiss).not.toHaveBeenCalled();
        expect(replace).not.toHaveBeenCalled();
    });
});
