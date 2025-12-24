/**
 * Settings Screen
 * User preferences, voice settings, privacy controls
 */

import { useTheme } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
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
                    Settings
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
                    Customize your experience
                </Text>
            </View>

            <View style={styles.content}>
                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color: colors.text.secondary,
                                fontFamily: typography.fonts.body.semiBold,
                                fontSize: typography.sizes.sm,
                            }
                        ]}
                    >
                        APPEARANCE
                    </Text>

                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.subtle,
                            }
                        ]}
                    >
                        <Pressable
                            style={styles.settingRow}
                            onPress={toggleTheme}
                        >
                            <Text
                                style={{
                                    color: colors.text.primary,
                                    fontFamily: typography.fonts.body.regular,
                                    fontSize: typography.sizes.base,
                                }}
                            >
                                Theme
                            </Text>
                            <Text
                                style={{
                                    color: colors.accent.secondary,
                                    fontFamily: typography.fonts.body.medium,
                                    fontSize: typography.sizes.base,
                                }}
                            >
                                {theme.isDark ? 'Dark' : 'Light'}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Voice Section */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color: colors.text.secondary,
                                fontFamily: typography.fonts.body.semiBold,
                                fontSize: typography.sizes.sm,
                            }
                        ]}
                    >
                        VOICE
                    </Text>

                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.subtle,
                            }
                        ]}
                    >
                        <View style={styles.settingRow}>
                            <Text
                                style={{
                                    color: colors.text.primary,
                                    fontFamily: typography.fonts.body.regular,
                                    fontSize: typography.sizes.base,
                                }}
                            >
                                TTS Voice
                            </Text>
                            <Text
                                style={{
                                    color: colors.text.tertiary,
                                    fontFamily: typography.fonts.body.regular,
                                    fontSize: typography.sizes.base,
                                }}
                            >
                                Default
                            </Text>
                        </View>
                    </View>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
});
