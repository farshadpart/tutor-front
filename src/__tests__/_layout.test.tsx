import { render } from '@testing-library/react-native';
import type { ComponentType } from 'react';
import { dark, light } from '@/src/constants/colors';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import Layout from '@/src/app/_layout';
import { useTheme } from '@/src/providers/ThemeProvider';

jest.mock('expo-router', () => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    const TestView = View as ComponentType<Record<string, unknown>>;
    const StackMock = ({ children, screenOptions }: any) =>
        React.createElement(TestView, { testID: 'stack', screenOptions }, children);
    return {
        Stack: Object.assign(StackMock, {
            Protected: ({ children, guard }: any) =>
                React.createElement(TestView, { testID: 'protected-route', guard }, children),
            Screen: ({ name, options }: any) =>
                React.createElement(TestView, { testID: `screen-${name}`, options }),
        }),
    };
});

jest.mock('@/src/hooks/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('@/src/providers/ThemeProvider', () => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    const TestView = View as ComponentType<Record<string, unknown>>;
    return {
        ThemeProvider: ({ children }: any) =>
            React.createElement(TestView, { testID: 'theme-provider' }, children),
        useTheme: jest.fn(),
    };
});

jest.mock('@/src/components/themedModal/ThemedModalContext', () => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    const TestView = View as ComponentType<Record<string, unknown>>;
    return {
        ThemedModalProvider: ({ children }: any) =>
            React.createElement(TestView, { testID: 'modal-provider' }, children),
    };
});

jest.mock('@/src/providers/UserSettingsProvider', () => ({
    UserSettingsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUseAuthStore = jest.mocked(useAuthStore);
const mockUseTheme = jest.mocked(useTheme);

describe('Layout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTheme.mockReturnValue({
            scheme: 'light',
            theme: light,
        });
    });

    it('wraps the stack in the theme and modal providers and applies light theme options', async () => {
        mockUseAuthStore.mockReturnValue({ user: undefined } as ReturnType<typeof useAuthStore>);

        const { getByTestId } = await render(<Layout />);

        expect(getByTestId('theme-provider')).toBeTruthy();
        expect(getByTestId('modal-provider')).toBeTruthy();
        expect(getByTestId('stack').props.screenOptions).toEqual({
            headerStyle: { backgroundColor: light.colors.surface },
            headerTintColor: light.colors.text,
            headerTitleStyle: { color: light.colors.text },
            contentStyle: { backgroundColor: light.colors.background },
            statusBarStyle: 'dark',
            animation: 'default',
        });
    });

    it('applies dark theme navigation options', async () => {
        mockUseAuthStore.mockReturnValue({ user: undefined } as ReturnType<typeof useAuthStore>);
        mockUseTheme.mockReturnValue({
            scheme: 'dark',
            theme: dark,
        });

        const { getByTestId } = await render(<Layout />);

        expect(getByTestId('stack').props.screenOptions).toEqual(
            expect.objectContaining({
                statusBarStyle: 'light',
                animation: 'fade',
                contentStyle: { backgroundColor: dark.colors.background },
            })
        );
    });

    it.each([
        {
            state: 'signed out',
            user: undefined,
            guards: [true, false, true, false],
        },
        {
            state: 'subscribed',
            user: { subscriptionGroup: 'premium' },
            guards: [false, true, false, false],
        },
        {
            state: 'unsubscribed',
            user: { subscriptionGroup: undefined },
            guards: [false, false, false, true],
        },
    ])('sets the expected route guards when the user is $state', async ({ user, guards }) => {
        mockUseAuthStore.mockReturnValue({ user } as ReturnType<typeof useAuthStore>);

        const { getAllByTestId } = await render(<Layout />);

        expect(getAllByTestId('protected-route').map((route) => route.props.guard)).toEqual(guards);
    });

    it('registers all screens with their expected options', async () => {
        mockUseAuthStore.mockReturnValue({ user: undefined } as ReturnType<typeof useAuthStore>);

        const { getByTestId } = await render(<Layout />);

        expect(getByTestId('screen-index').props.options).toEqual({ headerShown: false });
        expect(getByTestId('screen-chatArea').props.options).toEqual({ headerShown: false });
        expect(getByTestId('screen-User').props.options).toEqual({ title: 'You' });
        expect(getByTestId('screen-Login').props.options).toBeUndefined();
        expect(getByTestId('screen-Register').props.options).toBeUndefined();
        expect(getByTestId('screen-ResetPassword').props.options).toEqual({
            title: 'Reset Password',
        });
        expect(getByTestId('screen-Subscription').props.options).toBeUndefined();
    });
});
