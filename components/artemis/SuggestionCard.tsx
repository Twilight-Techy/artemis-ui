/**
 * SuggestionCard Component
 * Actionable card for suggestion messages with Yes/No buttons
 */

import { ConversationMessage } from '@/src/state';
import { useColors, useTheme } from '@/src/theme';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface SuggestionCardProps {
    message: ConversationMessage;
    onApprove: () => void;
    onReject: () => void;
}

export function SuggestionCard({ message, onApprove, onReject }: SuggestionCardProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    const isPending = message.pending !== false;

    // Entry animation
    const translateY = useSharedValue(30);
    const opacity = useSharedValue(0);
    const glowOpacity = useSharedValue(0.3);

    useEffect(() => {
        translateY.value = withTiming(0, {
            duration: 400,
            easing: Easing.out(Easing.back(1.1))
        });
        opacity.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.ease)
        });

        // Subtle pulsing glow
        if (isPending) {
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.5, { duration: 1500 }),
                    withTiming(0.3, { duration: 1500 })
                ),
                -1,
                true
            );
        }
    }, [isPending]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const handleApprove = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onApprove();
    };

    const handleReject = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onReject();
    };

    // If already responded, show result state
    if (!isPending) {
        return (
            <Animated.View style={[styles.container, animatedStyle]}>
                <View
                    style={[
                        styles.card,
                        styles.resolvedCard,
                        { backgroundColor: 'rgba(139, 92, 199, 0.05)' }
                    ]}
                >
                    <Text
                        style={[
                            styles.content,
                            styles.resolvedText,
                            {
                                color: colors.text.tertiary,
                                fontFamily: typography.fonts.body.regular,
                                fontSize: typography.sizes.sm,
                            }
                        ]}
                    >
                        {message.approved ? '✓ ' : '✗ '}{message.content}
                    </Text>
                </View>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {/* Glow effect */}
            <Animated.View
                style={[
                    styles.glowEffect,
                    glowStyle,
                    {
                        backgroundColor: colors.glow.primary,
                        shadowColor: colors.glow.primary,
                    }
                ]}
            />

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.background.secondary,
                        borderColor: 'rgba(139, 92, 199, 0.3)',
                    }
                ]}
            >
                <Text
                    style={[
                        styles.content,
                        {
                            color: colors.text.primary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.base,
                        }
                    ]}
                >
                    {message.content}
                </Text>

                <View style={styles.actions}>
                    <Pressable
                        style={[
                            styles.button,
                            styles.rejectButton,
                            { borderColor: 'rgba(255, 100, 100, 0.3)' }
                        ]}
                        onPress={handleReject}
                    >
                        <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>
                            ✗ No
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.button,
                            styles.approveButton,
                            {
                                backgroundColor: 'rgba(139, 92, 199, 0.2)',
                                borderColor: colors.glow.primary,
                            }
                        ]}
                        onPress={handleApprove}
                    >
                        <Text style={[styles.buttonText, { color: colors.glow.secondary }]}>
                            ✓ Yes
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    glowEffect: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
    },
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    resolvedCard: {
        padding: 12,
    },
    content: {
        lineHeight: 22,
        marginBottom: 12,
    },
    resolvedText: {
        marginBottom: 0,
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    approveButton: {},
    rejectButton: {
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 14,
    },
});

export default SuggestionCard;
