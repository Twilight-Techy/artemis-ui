/**
 * ReasoningOverlay Component
 * Sci-fi styled panel showing MCP reasoning thoughts
 * Like seeing inside Artemis's core - flowing data, not dev logs
 */

import { Thought, useReasoningStore } from '@/src/state';
import { useColors, useTheme } from '@/src/theme';
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    SlideInDown,
    SlideOutDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface ReasoningOverlayProps {
    onClose?: () => void;
}

export function ReasoningOverlay({ onClose }: ReasoningOverlayProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;
    const scrollViewRef = useRef<ScrollView>(null);

    const isVisible = useReasoningStore((s) => s.isVisible);
    const thoughts = useReasoningStore((s) => s.thoughts);
    const setVisible = useReasoningStore((s) => s.setVisible);

    // Pulse animation for the header
    const pulseOpacity = useSharedValue(0.6);

    useEffect(() => {
        pulseOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Auto-scroll to latest thought
    useEffect(() => {
        if (scrollViewRef.current && thoughts.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [thoughts.length]);

    const headerGlowStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            entering={SlideInDown.duration(300).easing(Easing.out(Easing.ease))}
            exiting={SlideOutDown.duration(200)}
            style={[styles.container, { backgroundColor: 'rgba(15, 10, 25, 0.95)' }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Animated.View style={[styles.headerGlow, headerGlowStyle, { backgroundColor: colors.glow.primary }]} />
                <View style={styles.headerContent}>
                    <View style={styles.headerIcon}>
                        <Text style={styles.iconText}>◈</Text>
                    </View>
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: colors.text.primary,
                                fontFamily: typography.fonts.heading.semiBold,
                            }
                        ]}
                    >
                        Artemis Insight
                    </Text>
                </View>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <Text style={[styles.closeText, { color: colors.text.tertiary }]}>✕</Text>
                </Pressable>
            </View>

            {/* Thoughts list */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.thoughtsContainer}
                contentContainerStyle={styles.thoughtsContent}
                showsVerticalScrollIndicator={false}
            >
                {thoughts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                            Reasoning will appear here...
                        </Text>
                    </View>
                ) : (
                    thoughts.map((thought, index) => (
                        <ThoughtLine
                            key={thought.id}
                            thought={thought}
                            isLatest={index === thoughts.length - 1}
                        />
                    ))
                )}
            </ScrollView>

            {/* Bottom border glow */}
            <View style={[styles.bottomGlow, { backgroundColor: colors.glow.primary }]} />
        </Animated.View>
    );
}

// Individual thought line component
function ThoughtLine({ thought, isLatest }: { thought: Thought; isLatest: boolean }) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    // Format timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Confidence indicator
    const getConfidenceColor = (confidence?: number) => {
        if (!confidence) return colors.text.tertiary;
        if (confidence > 0.8) return '#7DD3FC'; // High - cyan
        if (confidence > 0.5) return colors.glow.secondary; // Medium - purple
        return '#FFB86C'; // Low - orange
    };

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            style={[
                styles.thoughtLine,
                isLatest && styles.latestThought,
                isLatest && { borderLeftColor: colors.glow.secondary }
            ]}
        >
            <View style={styles.thoughtHeader}>
                <Text style={[styles.thoughtTime, { color: colors.text.tertiary }]}>
                    {formatTime(thought.timestamp)}
                </Text>
                {thought.confidence && (
                    <View
                        style={[
                            styles.confidenceBadge,
                            { backgroundColor: getConfidenceColor(thought.confidence) + '20' }
                        ]}
                    >
                        <Text
                            style={[
                                styles.confidenceText,
                                { color: getConfidenceColor(thought.confidence) }
                            ]}
                        >
                            {Math.round(thought.confidence * 100)}%
                        </Text>
                    </View>
                )}
            </View>
            <Text
                style={[
                    styles.thoughtContent,
                    {
                        color: isLatest ? colors.text.primary : colors.text.secondary,
                        fontFamily: typography.fonts.mono.regular,
                    }
                ]}
            >
                {thought.content}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '50%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(139, 92, 199, 0.2)',
    },
    headerGlow: {
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: 2,
        borderRadius: 1,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 18,
        color: '#AB7EE0',
    },
    headerTitle: {
        fontSize: 16,
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        fontSize: 18,
    },
    thoughtsContainer: {
        flex: 1,
    },
    thoughtsContent: {
        padding: 16,
        gap: 12,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    thoughtLine: {
        paddingLeft: 12,
        paddingVertical: 8,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(139, 92, 199, 0.3)',
    },
    latestThought: {
        borderLeftWidth: 3,
    },
    thoughtHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    thoughtTime: {
        fontSize: 10,
    },
    confidenceBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    confidenceText: {
        fontSize: 10,
        fontWeight: '600',
    },
    thoughtContent: {
        fontSize: 13,
        lineHeight: 18,
    },
    bottomGlow: {
        height: 1,
        opacity: 0.3,
    },
});

export default ReasoningOverlay;
