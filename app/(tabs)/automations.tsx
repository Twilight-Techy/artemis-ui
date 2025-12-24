/**
 * Automations Screen
 * Create and manage automation rules for smart home
 */

import { useTheme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AutomationsScreen() {
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
            <View style={styles.header}>
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
                    Automations
                </Text>
                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: colors.text.secondary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.sm,
                        }
                    ]}
                >
                    Create rules for smart automation
                </Text>
            </View>

            <View style={styles.content}>
                <View
                    style={[
                        styles.emptyState,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.default,
                        }
                    ]}
                >
                    <Text
                        style={{
                            color: colors.text.tertiary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.base,
                        }}
                    >
                        No automations configured
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.7,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    emptyState: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
