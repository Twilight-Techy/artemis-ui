/**
 * AutomationConfirmation Component
 * Modal for confirming automation creation/editing
 */

import { generateRuleBlocks, generateRuleSentence } from '@/src/automation/sentenceGenerator';
import { AutomationRule } from '@/src/automation/types';
import { useColors, useTheme } from '@/src/theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideOutDown,
} from 'react-native-reanimated';

interface AutomationConfirmationProps {
    rule: AutomationRule;
    isVisible: boolean;
    mode: 'create' | 'edit';
    onConfirm: () => void;
    onEdit?: () => void;
    onCancel: () => void;
}

export function AutomationConfirmation({
    rule,
    isVisible,
    mode,
    onConfirm,
    onEdit,
    onCancel,
}: AutomationConfirmationProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    const { when, doText } = generateRuleBlocks(rule);
    const sentence = generateRuleSentence(rule);

    const handleConfirm = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onConfirm();
    };

    const handleCancel = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCancel();
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.overlay}
        >
            <Pressable style={styles.backdrop} onPress={handleCancel} />

            <Animated.View
                entering={SlideInUp.duration(300).springify()}
                exiting={SlideOutDown.duration(200)}
                style={[
                    styles.modal,
                    { backgroundColor: colors.background.secondary }
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: colors.text.primary,
                                fontFamily: typography.fonts.heading.semiBold,
                            }
                        ]}
                    >
                        {mode === 'create' ? 'New Automation' : 'Edit Automation'}
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: colors.text.tertiary }
                        ]}
                    >
                        Here's what I understood:
                    </Text>
                </View>

                {/* Rule Preview Card */}
                <View
                    style={[
                        styles.previewCard,
                        {
                            backgroundColor: 'rgba(139, 92, 199, 0.08)',
                            borderColor: 'rgba(139, 92, 199, 0.25)',
                        }
                    ]}
                >
                    {/* Name */}
                    <Text
                        style={[
                            styles.ruleName,
                            {
                                color: colors.text.primary,
                                fontFamily: typography.fonts.heading.semiBold,
                            }
                        ]}
                    >
                        {rule.name}
                    </Text>

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
                                { color: colors.text.secondary }
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
                                    style={[styles.blockContent, { color: colors.text.secondary }]}
                                >
                                    • {action}
                                </Text>
                            ))}
                        </View>
                    </View>

                    {rule.location && (
                        <Text style={[styles.location, { color: colors.text.tertiary }]}>
                            📍 {rule.location}
                        </Text>
                    )}
                </View>

                {/* Explanation */}
                <View style={styles.explanationContainer}>
                    <Text
                        style={[
                            styles.explanation,
                            {
                                color: colors.text.secondary,
                                fontFamily: typography.fonts.body.regular,
                            }
                        ]}
                    >
                        {sentence}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Pressable
                        style={[
                            styles.button,
                            styles.cancelButton,
                            { borderColor: 'rgba(255, 100, 100, 0.3)' }
                        ]}
                        onPress={handleCancel}
                    >
                        <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>
                            Cancel
                        </Text>
                    </Pressable>

                    {onEdit && (
                        <Pressable
                            style={[
                                styles.button,
                                styles.editButton,
                                { borderColor: colors.text.tertiary }
                            ]}
                            onPress={onEdit}
                        >
                            <Text style={[styles.buttonText, { color: colors.text.secondary }]}>
                                Edit
                            </Text>
                        </Pressable>
                    )}

                    <Pressable
                        style={[
                            styles.button,
                            styles.confirmButton,
                            {
                                backgroundColor: 'rgba(139, 92, 199, 0.2)',
                                borderColor: colors.glow.primary,
                            }
                        ]}
                        onPress={handleConfirm}
                    >
                        <Text style={[styles.buttonText, { color: colors.glow.secondary }]}>
                            {mode === 'create' ? '✓ Create' : '✓ Save'}
                        </Text>
                    </Pressable>
                </View>

                {/* Trust note */}
                <Text style={[styles.trustNote, { color: colors.text.tertiary }]}>
                    You can change or disable this anytime.
                </Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modal: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    previewCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    ruleName: {
        fontSize: 16,
        marginBottom: 12,
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
    location: {
        fontSize: 12,
        marginTop: 4,
    },
    explanationContainer: {
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    explanation: {
        fontSize: 14,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    cancelButton: {
        backgroundColor: 'transparent',
    },
    editButton: {
        backgroundColor: 'transparent',
    },
    confirmButton: {},
    buttonText: {
        fontWeight: '600',
        fontSize: 14,
    },
    trustNote: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
    },
});

export default AutomationConfirmation;
