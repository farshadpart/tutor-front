import { TutorPartKey } from '@/src/components/tabbedMessage/types/TutorPartKey';
import { ViewStyle } from 'react-native';

export type TabbedMessageProps = {
    response?: string;
    revisedSentence?: string;
    correction?: string;
    initialSelected?: TutorPartKey;
    onSelectedChange?: (key: TutorPartKey) => void;
    containerStyle?: ViewStyle;
};