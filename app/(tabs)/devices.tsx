/**
 * Devices Screen
 * Smart home command center - displays and controls connected devices
 */

import { useTheme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DevicesScreen() {
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
                    Devices
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
                    Manage your connected devices
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
                        No devices connected yet
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
