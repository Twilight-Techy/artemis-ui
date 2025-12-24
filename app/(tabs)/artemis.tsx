/**
 * Artemis Main Screen
 * The heart of the app - voice/chat interface with the AI assistant
 */

import { useTheme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArtemisScreen() {
    const { theme } = useTheme();
    const { colors, typography } = theme;
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background.primary,
                    paddingTop: insets.top,
                }
            ]}
        >
            <View style={styles.content}>
                {/* Orb will go here */}
                <View
                    style={[
                        styles.orbPlaceholder,
                        {
                            backgroundColor: colors.accent.primary,
                            shadowColor: colors.glow.primary,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.6,
                            shadowRadius: 30,
                        }
                    ]}
                />

                <Text
                    style={[
                        styles.title,
                        {
                            color: colors.text.primary,
                            fontFamily: typography.fonts.heading.semiBold,
                            fontSize: typography.sizes.xl,
                        }
                    ]}
                >
                    Artemis
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: colors.text.secondary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.base,
                        }
                    ]}
                >
                    Your intelligent home assistant
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    orbPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 32,
    },
    title: {
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.8,
    },
});
