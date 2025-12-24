/**
 * Artemis State Management
 * Central export for all stores
 */

// Core Artemis state machine
export {
    selectArtemisState, selectCurrentSuggestion, selectIsListening, selectIsOffline, selectIsProcessing,
    selectIsSuggesting, selectMessages, selectVoiceAmplitude,
    stateToOrbBehavior, useArtemisStore, type ArtemisState, type ExecutionResult, type Message,
    type MessageType, type ReasoningTrace, type Suggestion, type VoiceState
} from './artemisStore';

// Device management
export {
    selectAllDevices, selectAllSensors, selectOnlineDevices, useDeviceStore, type Device, type DeviceCapability, type DeviceStatus, type DeviceType, type Protocol, type Sensor
} from './deviceStore';

// User settings
export {
    selectBehaviorSettings, selectHasCompletedOnboarding, selectHasSeenIntro, selectPrivacySettings, selectTransparencySettings, selectVoiceSettings, useSettingsStore, type ApprovalMode, type BehaviorSettings, type PrivacySettings, type TransparencySettings, type VoiceSettings
} from './settingsStore';

// Conversation
export {
    selectMessages as selectConversationMessages,
    selectPendingSuggestion,
    useConversationStore,
    type ConversationMessage,
    type MessageType as ConversationMessageType,
    type SuggestionData
} from './conversationStore';

