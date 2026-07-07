import { act, fireEvent, render } from '@testing-library/react-native';
import {
    Keyboard,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
} from 'react-native';
import KeyboardShiftView from './KeyboardShiftView';

type KeyboardListenerCallback = Parameters<typeof Keyboard.addListener>[1];

describe('KeyboardShiftView', () => {
    const listeners: Partial<Record<string, KeyboardListenerCallback>> = {};
    const showRemove = jest.fn();
    const hideRemove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Keyboard, 'addListener').mockImplementation((eventName, callback) => {
            listeners[eventName] = callback;

            return {
                remove: String(eventName).includes('Show') ? showRemove : hideRemove,
            } as unknown as ReturnType<typeof Keyboard.addListener>;
        });
        jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
        jest.spyOn(LayoutAnimation, 'configureNext').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.restoreAllMocks();
        Object.keys(listeners).forEach((eventName) => {
            delete listeners[eventName];
        });
    });

    it('renders children inside a pressable container by default and dismisses the keyboard on press', async () => {
        const { getByText } = await render(
            <KeyboardShiftView style={{ backgroundColor: 'red' }}>
                <Text>Lesson prompt</Text>
            </KeyboardShiftView>
        );

        const child = getByText('Lesson prompt');
        const container = child.parent;
        expect(child).toBeTruthy();

        expect(StyleSheet.flatten(container?.props.style)).toEqual(
            expect.objectContaining({
                backgroundColor: 'red',
                flex: 1,
                paddingBottom: 0,
            })
        );

        await fireEvent.press(container!);

        expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    });

    it('renders a non-pressable view when scrollable is enabled', async () => {
        const { getByText } = await render(
            <KeyboardShiftView scrollable>
                <Text>Scrollable content</Text>
            </KeyboardShiftView>
        );
        const container = getByText('Scrollable content').parent;

        expect(container?.props.onPress).toBeUndefined();
        expect(StyleSheet.flatten(container?.props.style)).toEqual(
            expect.objectContaining({
                flex: 1,
                paddingBottom: 0,
            })
        );
    });

    it('listens for platform keyboard events and applies the keyboard height plus extra height', async () => {
        const { getByText } = await render(
            <KeyboardShiftView extraHeight={32}>
                <Text>Keyboard aware content</Text>
            </KeyboardShiftView>
        );
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        expect(Keyboard.addListener).toHaveBeenCalledWith(showEvent, expect.any(Function));
        expect(Keyboard.addListener).toHaveBeenCalledWith(hideEvent, expect.any(Function));

        await act(() => {
            listeners[showEvent]?.({
                endCoordinates: {
                    height: 240,
                },
            } as Parameters<KeyboardListenerCallback>[0]);
        });

        expect(LayoutAnimation.configureNext).toHaveBeenCalledWith(
            LayoutAnimation.Presets.easeInEaseOut
        );
        expect(StyleSheet.flatten(getByText('Keyboard aware content').parent?.props.style)).toEqual(
            expect.objectContaining({
                paddingBottom: 272,
            })
        );

        await act(() => {
            listeners[hideEvent]?.({} as Parameters<KeyboardListenerCallback>[0]);
        });

        expect(StyleSheet.flatten(getByText('Keyboard aware content').parent?.props.style)).toEqual(
            expect.objectContaining({
                paddingBottom: 0,
            })
        );
    });

    it('removes keyboard listeners on unmount', async () => {
        const { unmount } = await render(
            <KeyboardShiftView>
                <Text>Unmount content</Text>
            </KeyboardShiftView>
        );

        await act(() => {
            unmount();
        });

        expect(showRemove).toHaveBeenCalledTimes(1);
        expect(hideRemove).toHaveBeenCalledTimes(1);
    });
});
