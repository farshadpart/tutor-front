import { TutorPartKey } from '@/src/components/tabbedMessage/types/TutorPartKey';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type TabItem = {
    key: TutorPartKey;
    label: string;
    icon: IconName;
    value?: string;
};