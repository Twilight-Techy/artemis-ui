/**
 * Automations Screen
 * View and manage automation rules
 */

import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AutomationBuilder, AutomationConfirmation, AutomationList } from '@/components/automation';
import { AutomationRule } from '@/src/automation/types';
import { useAutomationStore } from '@/src/state/automationStore';
import { useTheme } from '@/src/theme';

export default function AutomationsScreen() {
    const { theme } = useTheme();
    const { colors, typography } = theme;
    const insets = useSafeAreaInsets();

    const rules = useAutomationStore((s) => s.rules);
    const addRule = useAutomationStore((s) => s.addRule);
    const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);

    // Count stats
    const enabledCount = rules.filter((r) => r.enabled).length;
    const totalTriggers = rules.reduce((sum, r) => sum + r.triggerCount, 0);

    const handleRulePress = (rule: AutomationRule) => {
        setSelectedRule(rule);
        setShowConfirmation(true);
    };

    const handleAddPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowBuilder(true);
    };

    const handleBuilderComplete = (rule: AutomationRule) => {
        addRule(rule);
        setShowBuilder(false);
    };

    const handleBuilderCancel = () => {
        setShowBuilder(false);
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        setSelectedRule(null);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setSelectedRule(null);
    };

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
            {/* Header */}
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
                    Rules that run automatically
                </Text>
            </View>

            {/* Stats Bar */}
            {rules.length > 0 && (
                <View style={styles.statsBar}>
                    <View
                        style={[
                            styles.statBadge,
                            { backgroundColor: 'rgba(139, 92, 199, 0.15)' }
                        ]}
                    >
                        <Text style={[styles.statValue, { color: colors.glow.secondary }]}>
                            {enabledCount}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
                            Active
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.statBadge,
                            { backgroundColor: 'rgba(74, 222, 128, 0.15)' }
                        ]}
                    >
                        <Text style={[styles.statValue, { color: '#4ADE80' }]}>
                            {totalTriggers}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
                            Triggered
                        </Text>
                    </View>
                </View>
            )}

            {/* Automation List */}
            <View style={styles.content}>
                <AutomationList onRulePress={handleRulePress} />
            </View>

            {/* Add Button */}
            <Pressable
                style={[
                    styles.addButton,
                    {
                        backgroundColor: colors.glow.primary,
                        bottom: insets.bottom + 80,
                    }
                ]}
                onPress={handleAddPress}
            >
                <Text style={styles.addButtonText}>+ Add Automation</Text>
            </Pressable>

            {/* Automation Builder */}
            <AutomationBuilder
                isVisible={showBuilder}
                onComplete={handleBuilderComplete}
                onCancel={handleBuilderCancel}
            />

            {/* Confirmation Modal */}
            {selectedRule && (
                <AutomationConfirmation
                    rule={selectedRule}
                    isVisible={showConfirmation}
                    mode="edit"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
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
        paddingBottom: 12,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.7,
    },
    statsBar: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 12,
        gap: 12,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
    },
    content: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        right: 24,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 24,
        shadowColor: '#8B5CC7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
