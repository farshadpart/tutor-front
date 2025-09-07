import { View, StyleSheet } from 'react-native';
import {useState} from "react";
import { Drawer } from 'react-native-paper';

export const DrawerOpen = () => {
    const [active, setActive] = useState<string>('');

    const handlePress = (item: string) => {
        setActive(item);
    };

    return (
        <View style={styles.container}>
            <Drawer.Section title="Menu">
                <Drawer.Item
                    label="Inbox"
                    icon="inbox"
                    active={active === 'inbox'}
                    onPress={() => handlePress('inbox')}
                />
                <Drawer.Item
                    label="Starred"
                    icon="star"
                    active={active === 'starred'}
                    onPress={() => handlePress('starred')}
                />
                <Drawer.Item
                    label="Sent Mail"
                    icon="send"
                    active={active === 'send'}
                    onPress={() => handlePress('send')}
                />
                <Drawer.Item
                    label="Settings"
                    icon="cog"
                    active={active === 'settings'}
                    onPress={() => handlePress('settings')}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 240,
        backgroundColor: '#f5f5f5',
        flex: 1,
    },
});
