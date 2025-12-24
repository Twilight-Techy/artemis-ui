/**
 * Automation Store
 * Manages user-defined automations with trust levels
 */

import { AutomationDraft, AutomationRule, generateRuleId, TrustLevel } from '@/src/automation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============================================================================
// Store Interface
// ============================================================================

interface AutomationStoreState {
    rules: AutomationRule[];
    currentDraft: AutomationDraft | null;

    // Trust settings per action type
    actionTrustLevels: Record<string, TrustLevel>;
}

interface AutomationStoreActions {
    // CRUD
    addRule: (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => string;
    updateRule: (id: string, updates: Partial<AutomationRule>) => void;
    deleteRule: (id: string) => void;

    // Enable/Disable
    toggleRule: (id: string) => void;
    enableRule: (id: string) => void;
    disableRule: (id: string) => void;

    // Trust
    setRuleTrust: (id: string, trust: TrustLevel) => void;
    setActionTypeTrust: (actionType: string, trust: TrustLevel) => void;

    // Draft management
    setDraft: (draft: AutomationDraft | null) => void;
    updateDraft: (updates: Partial<AutomationDraft>) => void;
    clearDraft: () => void;

    // Execution tracking
    recordTrigger: (id: string) => void;

    // Utilities
    getRuleById: (id: string) => AutomationRule | undefined;
    reset: () => void;
}

type AutomationStore = AutomationStoreState & AutomationStoreActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: AutomationStoreState = {
    rules: [],
    currentDraft: null,
    actionTrustLevels: {},
};

// ============================================================================
// Sample Rules for Demo
// ============================================================================

const sampleRules: AutomationRule[] = [
    {
        id: 'sample_1',
        name: 'Cool Down',
        description: 'Turn on fan when it gets hot',
        trigger: {
            type: 'sensor',
            sensorType: 'temperature',
            operator: '>',
            value: 28,
            unit: '°C',
        },
        actions: [
            { type: 'turn_on', deviceId: 'fan-bedroom', deviceName: 'bedroom fan' },
        ],
        location: 'bedroom',
        enabled: true,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        triggerCount: 12,
        riskLevel: 'low',
        trustLevel: 'auto_approve',
        requiresConfirmation: false,
        createdBy: 'voice',
    },
    {
        id: 'sample_2',
        name: 'Evening Lights',
        description: 'Turn on lights at sunset',
        trigger: {
            type: 'time',
            time: '18:30',
            repeat: true,
        },
        actions: [
            { type: 'turn_on', deviceId: 'light-living', deviceName: 'living room lights' },
            { type: 'set', deviceId: 'light-living', deviceName: 'lights', property: 'brightness', value: 70, unit: '%' },
        ],
        location: 'living room',
        enabled: true,
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 172800000,
        triggerCount: 28,
        riskLevel: 'low',
        trustLevel: 'auto_approve',
        requiresConfirmation: false,
        createdBy: 'manual',
    },
];

// ============================================================================
// Store Creation
// ============================================================================

export const useAutomationStore = create<AutomationStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            rules: sampleRules, // Start with samples for demo

            addRule: (ruleData) => {
                const id = generateRuleId();
                const now = Date.now();
                const newRule: AutomationRule = {
                    ...ruleData,
                    id,
                    createdAt: now,
                    updatedAt: now,
                    triggerCount: 0,
                };

                set((state) => ({
                    rules: [...state.rules, newRule],
                }));

                return id;
            },

            updateRule: (id, updates) => {
                set((state) => ({
                    rules: state.rules.map((rule) =>
                        rule.id === id
                            ? { ...rule, ...updates, updatedAt: Date.now() }
                            : rule
                    ),
                }));
            },

            deleteRule: (id) => {
                set((state) => ({
                    rules: state.rules.filter((rule) => rule.id !== id),
                }));
            },

            toggleRule: (id) => {
                set((state) => ({
                    rules: state.rules.map((rule) =>
                        rule.id === id
                            ? { ...rule, enabled: !rule.enabled, updatedAt: Date.now() }
                            : rule
                    ),
                }));
            },

            enableRule: (id) => {
                get().updateRule(id, { enabled: true });
            },

            disableRule: (id) => {
                get().updateRule(id, { enabled: false });
            },

            setRuleTrust: (id, trust) => {
                get().updateRule(id, {
                    trustLevel: trust,
                    requiresConfirmation: trust === 'ask_always',
                });
            },

            setActionTypeTrust: (actionType, trust) => {
                set((state) => ({
                    actionTrustLevels: {
                        ...state.actionTrustLevels,
                        [actionType]: trust,
                    },
                }));
            },

            setDraft: (draft) => {
                set({ currentDraft: draft });
            },

            updateDraft: (updates) => {
                set((state) => ({
                    currentDraft: state.currentDraft
                        ? { ...state.currentDraft, ...updates }
                        : updates,
                }));
            },

            clearDraft: () => {
                set({ currentDraft: null });
            },

            recordTrigger: (id) => {
                set((state) => ({
                    rules: state.rules.map((rule) =>
                        rule.id === id
                            ? {
                                ...rule,
                                lastTriggered: Date.now(),
                                triggerCount: rule.triggerCount + 1,
                            }
                            : rule
                    ),
                }));
            },

            getRuleById: (id) => {
                return get().rules.find((rule) => rule.id === id);
            },

            reset: () => {
                set({ ...initialState, rules: sampleRules });
            },
        }),
        {
            name: 'artemis-automations',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                rules: state.rules,
                actionTrustLevels: state.actionTrustLevels,
            }),
        }
    )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectAllRules = (state: AutomationStore) => state.rules;
export const selectEnabledRules = (state: AutomationStore) =>
    state.rules.filter((r) => r.enabled);
export const selectRuleById = (id: string) => (state: AutomationStore) =>
    state.rules.find((r) => r.id === id);
export const selectCurrentDraft = (state: AutomationStore) => state.currentDraft;
