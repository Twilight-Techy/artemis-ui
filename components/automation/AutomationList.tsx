/**
 * AutomationList Component
 * List of user automations with toggle switches
 */

import { AutomationRule } from '@/src/automation/types';
import { useAutomationStore } from '@/src/state/automationStore';
import { useColors, useTheme } from '@/src/theme';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AutomationRuleCard } from './AutomationRuleCard';

interface AutomationListProps {
    onRulePress?: (rule: AutomationRule) => void;
    showEmpty?: boolean;
}

export function AutomationList({ onRulePress, showEmpty = true }: AutomationListProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    const rules = useAutomationStore((s) => s.rules);
    const toggleRule = useAutomationStore((s) => s.toggleRule);

    // Sort: enabled first, then by last triggered
    const sortedRules = [...rules].sort((a, b) => {
        if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
        return (b.lastTriggered || 0) - (a.lastTriggered || 0);
    });

    if (rules.length === 0 && showEmpty) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyIcon]}>⚡</Text>
                <Text
                    style={[
                        styles.emptyTitle,
                        {
                            color: colors.text.primary,
                            fontFamily: typography.fonts.heading.semiBold,
                        }
                    ]}
                >
                    No Automations Yet
                </Text>
                <Text
                    style={[
                        styles.emptyText,
                        { color: colors.text.tertiary }
                    ]}
                >
                    Say something like "when it gets hot, turn on the fan" to create your first automation.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={sortedRules}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <AutomationRuleCard
                    rule={item}
                    onToggle={toggleRule}
                    onPress={onRulePress}
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default AutomationList;
