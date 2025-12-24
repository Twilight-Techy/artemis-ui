/**
 * AutomationRuleCard Component
 * Visual display of an automation rule with WHEN/DO blocks
 */

import { generateRuleBlocks } from '@/src/automation/sentenceGenerator';
import { AutomationRule } from '@/src/automation/types';
import { useColors, useTheme } from '@/src/theme';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AutomationRuleCardProps {
    rule: AutomationRule;
    onToggle?: (id: string) => void;
    onPress?: (rule: AutomationRule) => void;
    onDelete?: (id: string) => void;
    compact?: boolean;
}

export function AutomationRuleCard({
    rule,
    onToggle,
    onPress,
    onDelete,
    compact = false,
}: AutomationRuleCardProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    const { when, doText } = generateRuleBlocks(rule);

    // Trust level indicator
    const getTrustColor = () => {
        switch (rule.trustLevel) {
            case 'auto_approve': return '#4ADE80'; // Green
            case 'ask_once': return '#FBBF24'; // Yellow
            case 'ask_always': return colors.glow.primary; // Purple
        }
    };

    const getTrustLabel = () => {
        switch (rule.trustLevel) {
            case 'auto_approve': return 'Auto';
            case 'ask_once': return 'Ask once';
            case 'ask_always': return 'Ask always';
        }
    };

    return (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
            <Pressable
                onPress={() => onPress?.(rule)}
                style={[
                    styles.container,
                    !rule.enabled && styles.disabledContainer,
                    {
                        backgroundColor: 'rgba(139, 92, 199, 0.08)',
                        borderColor: rule.enabled
                            ? 'rgba(139, 92, 199, 0.25)'
                            : 'rgba(139, 92, 199, 0.1)',
                    }
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <Text
                            style={[
                                styles.name,
                                !rule.enabled && styles.disabledText,
                                {
                                    color: colors.text.primary,
                                    fontFamily: typography.fonts.heading.semiBold,
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {rule.name}
                        </Text>
                        {rule.location && (
                            <Text
                                style={[
                                    styles.location,
                                    { color: colors.text.tertiary }
                                ]}
                            >
                                {rule.location}
                            </Text>
                        )}
                    </View>
                    <Switch
                        value={rule.enabled}
                        onValueChange={() => onToggle?.(rule.id)}
                        trackColor={{
                            false: 'rgba(139, 92, 199, 0.2)',
                            true: colors.glow.primary
                        }}
                        thumbColor={rule.enabled ? '#fff' : '#888'}
                    />
                </View>

                {!compact && (
                    <>
                        {/* WHEN Block */}
                        <View style={styles.block}>
                            <View
                                style={[
                                    styles.blockLabel,
                                    { backgroundColor: 'rgba(139, 92, 199, 0.2)' }
                                ]}
                            >
                                <Text style={[styles.labelText, { color: colors.glow.secondary }]}>
                                    WHEN
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.blockContent,
                                    !rule.enabled && styles.disabledText,
                                    {
                                        color: colors.text.secondary,
                                        fontFamily: typography.fonts.body.regular,
                                    }
                                ]}
                            >
                                {when}
                            </Text>
                        </View>

                        {/* DO Block */}
                        <View style={styles.block}>
                            <View
                                style={[
                                    styles.blockLabel,
                                    { backgroundColor: 'rgba(74, 222, 128, 0.2)' }
                                ]}
                            >
                                <Text style={[styles.labelText, { color: '#4ADE80' }]}>
                                    DO
                                </Text>
                            </View>
                            <View style={styles.actionsContainer}>
                                {doText.map((action, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            styles.blockContent,
                                            !rule.enabled && styles.disabledText,
                                            {
                                                color: colors.text.secondary,
                                                fontFamily: typography.fonts.body.regular,
                                            }
                                        ]}
                                    >
                                        • {action}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View
                                style={[
                                    styles.trustBadge,
                                    { backgroundColor: getTrustColor() + '20' }
                                ]}
                            >
                                <View
                                    style={[
                                        styles.trustDot,
                                        { backgroundColor: getTrustColor() }
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.trustText,
                                        { color: getTrustColor() }
                                    ]}
                                >
                                    {getTrustLabel()}
                                </Text>
                            </View>

                            {rule.triggerCount > 0 && (
                                <Text style={[styles.stats, { color: colors.text.tertiary }]}>
                                    Triggered {rule.triggerCount} times
                                </Text>
                            )}
                        </View>
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginVertical: 6,
    },
    disabledContainer: {
        opacity: 0.6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleRow: {
        flex: 1,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
    },
    location: {
        fontSize: 12,
        marginTop: 2,
    },
    block: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    blockLabel: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 10,
        minWidth: 50,
        alignItems: 'center',
    },
    labelText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    blockContent: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    actionsContainer: {
        flex: 1,
    },
    disabledText: {
        opacity: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(139, 92, 199, 0.1)',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    trustDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    trustText: {
        fontSize: 11,
        fontWeight: '600',
    },
    stats: {
        fontSize: 11,
    },
});

export default AutomationRuleCard;
