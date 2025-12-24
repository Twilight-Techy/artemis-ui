/**
 * Settings Store
 * User preferences for Artemis behavior, voice, and privacy
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export type ApprovalMode = 'always_ask' | 'smart' | 'auto_approve';

export interface VoiceSettings {
    ttsEnabled: boolean;
    ttsVoice: string;
    ttsSpeed: number; // 0.5 - 2.0
    ttsVolume: number; // 0.0 - 1.0
    autoPlayResponses: boolean;
}

export interface PrivacySettings {
    saveConversationHistory: boolean;
    shareAnalytics: boolean;
    micPermissionGranted: boolean;
}

export interface BehaviorSettings {
    approvalMode: ApprovalMode;
    showWelcomeMessage: boolean;
    hapticFeedback: boolean;
    soundEffects: boolean;
}

export interface TransparencySettings {
    showReasoning: boolean;
    showToolsUsed: boolean;
    debugMode: boolean;
}

// ============================================================================
// Store Interface
// ============================================================================

interface SettingsStoreState {
    // Voice settings
    voice: VoiceSettings;

    // Privacy settings
    privacy: PrivacySettings;

    // Behavior settings
    behavior: BehaviorSettings;

    // MCP transparency
    transparency: TransparencySettings;

    // Onboarding
    hasCompletedOnboarding: boolean;

    // App info
    appVersion: string;
}

interface SettingsStoreActions {
    // Voice settings
    setTTSEnabled: (enabled: boolean) => void;
    setTTSVoice: (voice: string) => void;
    setTTSSpeed: (speed: number) => void;
    setTTSVolume: (volume: number) => void;
    setAutoPlayResponses: (enabled: boolean) => void;
    updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;

    // Privacy settings
    setSaveConversationHistory: (enabled: boolean) => void;
    setShareAnalytics: (enabled: boolean) => void;
    setMicPermissionGranted: (granted: boolean) => void;
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;

    // Behavior settings
    setApprovalMode: (mode: ApprovalMode) => void;
    setShowWelcomeMessage: (show: boolean) => void;
    setHapticFeedback: (enabled: boolean) => void;
    setSoundEffects: (enabled: boolean) => void;
    updateBehaviorSettings: (settings: Partial<BehaviorSettings>) => void;

    // Transparency settings
    setShowReasoning: (show: boolean) => void;
    setShowToolsUsed: (show: boolean) => void;
    setDebugMode: (enabled: boolean) => void;
    updateTransparencySettings: (settings: Partial<TransparencySettings>) => void;

    // Onboarding
    completeOnboarding: () => void;
    resetOnboarding: () => void;

    // Reset all settings
    resetToDefaults: () => void;
}

type SettingsStore = SettingsStoreState & SettingsStoreActions;

// ============================================================================
// Default Values
// ============================================================================

const defaultVoiceSettings: VoiceSettings = {
    ttsEnabled: true,
    ttsVoice: 'default',
    ttsSpeed: 1.0,
    ttsVolume: 0.8,
    autoPlayResponses: true,
};

const defaultPrivacySettings: PrivacySettings = {
    saveConversationHistory: true,
    shareAnalytics: false,
    micPermissionGranted: false,
};

const defaultBehaviorSettings: BehaviorSettings = {
    approvalMode: 'always_ask',
    showWelcomeMessage: true,
    hapticFeedback: true,
    soundEffects: true,
};

const defaultTransparencySettings: TransparencySettings = {
    showReasoning: false,
    showToolsUsed: false,
    debugMode: false,
};

const initialState: SettingsStoreState = {
    voice: defaultVoiceSettings,
    privacy: defaultPrivacySettings,
    behavior: defaultBehaviorSettings,
    transparency: defaultTransparencySettings,
    hasCompletedOnboarding: false,
    appVersion: '1.0.0',
};

// ============================================================================
// Store Creation (with persistence)
// ============================================================================

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...initialState,

            // Voice settings
            setTTSEnabled: (enabled) =>
                set((state) => ({
                    voice: { ...state.voice, ttsEnabled: enabled },
                })),

            setTTSVoice: (voice) =>
                set((state) => ({
                    voice: { ...state.voice, ttsVoice: voice },
                })),

            setTTSSpeed: (speed) =>
                set((state) => ({
                    voice: { ...state.voice, ttsSpeed: Math.max(0.5, Math.min(2.0, speed)) },
                })),

            setTTSVolume: (volume) =>
                set((state) => ({
                    voice: { ...state.voice, ttsVolume: Math.max(0, Math.min(1, volume)) },
                })),

            setAutoPlayResponses: (enabled) =>
                set((state) => ({
                    voice: { ...state.voice, autoPlayResponses: enabled },
                })),

            updateVoiceSettings: (settings) =>
                set((state) => ({
                    voice: { ...state.voice, ...settings },
                })),

            // Privacy settings
            setSaveConversationHistory: (enabled) =>
                set((state) => ({
                    privacy: { ...state.privacy, saveConversationHistory: enabled },
                })),

            setShareAnalytics: (enabled) =>
                set((state) => ({
                    privacy: { ...state.privacy, shareAnalytics: enabled },
                })),

            setMicPermissionGranted: (granted) =>
                set((state) => ({
                    privacy: { ...state.privacy, micPermissionGranted: granted },
                })),

            updatePrivacySettings: (settings) =>
                set((state) => ({
                    privacy: { ...state.privacy, ...settings },
                })),

            // Behavior settings
            setApprovalMode: (mode) =>
                set((state) => ({
                    behavior: { ...state.behavior, approvalMode: mode },
                })),

            setShowWelcomeMessage: (show) =>
                set((state) => ({
                    behavior: { ...state.behavior, showWelcomeMessage: show },
                })),

            setHapticFeedback: (enabled) =>
                set((state) => ({
                    behavior: { ...state.behavior, hapticFeedback: enabled },
                })),

            setSoundEffects: (enabled) =>
                set((state) => ({
                    behavior: { ...state.behavior, soundEffects: enabled },
                })),

            updateBehaviorSettings: (settings) =>
                set((state) => ({
                    behavior: { ...state.behavior, ...settings },
                })),

            // Transparency settings
            setShowReasoning: (show) =>
                set((state) => ({
                    transparency: { ...state.transparency, showReasoning: show },
                })),

            setShowToolsUsed: (show) =>
                set((state) => ({
                    transparency: { ...state.transparency, showToolsUsed: show },
                })),

            setDebugMode: (enabled) =>
                set((state) => ({
                    transparency: { ...state.transparency, debugMode: enabled },
                })),

            updateTransparencySettings: (settings) =>
                set((state) => ({
                    transparency: { ...state.transparency, ...settings },
                })),

            // Onboarding
            completeOnboarding: () =>
                set({ hasCompletedOnboarding: true }),

            resetOnboarding: () =>
                set({ hasCompletedOnboarding: false }),

            // Reset to defaults
            resetToDefaults: () =>
                set({
                    voice: defaultVoiceSettings,
                    privacy: defaultPrivacySettings,
                    behavior: defaultBehaviorSettings,
                    transparency: defaultTransparencySettings,
                }),
        }),
        {
            name: 'artemis-settings',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                voice: state.voice,
                privacy: state.privacy,
                behavior: state.behavior,
                transparency: state.transparency,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
            }),
        }
    )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectVoiceSettings = (state: SettingsStore) => state.voice;
export const selectPrivacySettings = (state: SettingsStore) => state.privacy;
export const selectBehaviorSettings = (state: SettingsStore) => state.behavior;
export const selectTransparencySettings = (state: SettingsStore) => state.transparency;
export const selectHasCompletedOnboarding = (state: SettingsStore) => state.hasCompletedOnboarding;
