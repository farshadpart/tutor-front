import { TutorPartKey } from '@/src/components/tabbedMessage/types/TutorPartKey';
import { ViewStyle } from 'react-native';

export type TabbedMessageProps = {
    messageId: string;
    response?: string;
    revisedSentence?: string;
    correction?: string;
    audioUrl?: string;
    initialSelected?: TutorPartKey;
    onSelectedChange?: (key: TutorPartKey) => void;
    containerStyle?: ViewStyle;
};