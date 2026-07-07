import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useRouter } from "expo-router";
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const avatarImages = {
    light: require('@/assets/images/avatar-light.png'),
    dark: require('@/assets/images/avatar-dark.png'),
};

export const UserSummary = () => {
    const authStore = useAuthStore();
    const { scheme } = useTheme();
    const router = useRouter();

    const userPhoto = avatarImages[scheme as keyof typeof avatarImages];

    return (
        <ThemedTouchableOpacity onPress={() => router.push('/User')} style={[styles.container, { backgroundColor: 'transparent' }]} activeOpacity={1}>
            <View style={styles.avatarContainer}>
                <Image testID="user-summary-avatar" source={userPhoto} style={styles.avatar} />
            </View>
            <ThemedText style={styles.name} numberOfLines={1}>
                {authStore.user?.email}
            </ThemedText>
        </ThemedTouchableOpacity>
    );
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
    },
    avatarContainer: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8
    },
});
