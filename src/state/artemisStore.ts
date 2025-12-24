/**
 * Artemis State Machine
 * Core state management for the AI assistant's interaction states
 * 
 * States:
 * - IDLE: Waiting for input, orb breathing
 * - LISTENING: Capturing voice, waveform active
 * - PROCESSING: MCP running, orb swirling
 * - RESPONDING: TTS playing, orb pulsing to speech
 * - SUGGESTING: Awaiting user decision on action
 * - EXECUTING: Performing approved action
 * - OFFLINE: No connectivity
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export type ArtemisState =
    | 'IDLE'
    | 'LISTENING'
    | 'PROCESSING'
    | 'RESPONDING'
    | 'SUGGESTING'
    | 'EXECUTING'
    | 'OFFLINE';

export type MessageType = 'user' | 'assistant' | 'suggestion' | 'system';

export interface Message {
    id: string;
    type: MessageType;
    content: string;
    timestamp: number;
    metadata?: {
        // For suggestions
        suggestionId?: string;
        actionType?: 'device' | 'function' | 'automation';
        approved?: boolean;
        // For assistant messages
        ttsPlayed?: boolean;
        // For reasoning (MCP transparency)
        reasoning?: ReasoningTrace;
    };
}

export interface Suggestion {
    id: string;
    title: string;
    description: string;
    actionType: 'device' | 'function' | 'automation';
    targetId: string;
    parameters?: Record<string, unknown>;
    urgency: 'low' | 'normal' | 'high';
    previewEffect: string;
    requiresApproval: boolean;
}

export interface ReasoningTrace {
    intent: string;
    confidence: number;
    toolsUsed: string[];
    summary: string;
}

export interface ExecutionResult {
    status: 'success' | 'partial' | 'failed';
    message: string;
    affectedDevices?: string[];
    error?: string;
}

// Voice input state
export interface VoiceState {
    isListening: boolean;
    transcription: string;
    amplitude: number; // 0-1, for waveform animation
}

// ============================================================================
// Store State Interface
// ============================================================================

interface ArtemisStoreState {
    // Core state machine
    state: ArtemisState;
    previousState: ArtemisState | null;

    // Messages/conversation
    messages: Message[];

    // Current interaction
    currentTranscription: string;
    currentSuggestion: Suggestion | null;

    // Voice state (for UI animations)
    voice: VoiceState;

    // Execution feedback
    lastExecutionResult: ExecutionResult | null;

    // Connectivity
    isOnline: boolean;

    // MCP transparency (optional feature)
    showReasoning: boolean;
}

// ============================================================================
// Store Actions Interface
// ============================================================================

interface ArtemisStoreActions {
    // State transitions
    startListening: () => void;
    stopListening: (transcription: string) => void;
    cancelListening: () => void;

    startProcessing: () => void;

    startResponding: (response: string, suggestion?: Suggestion) => void;
    finishResponding: () => void;

    showSuggestion: (suggestion: Suggestion) => void;
    approveSuggestion: () => void;
    declineSuggestion: () => void;

    startExecuting: () => void;
    finishExecuting: (result: ExecutionResult) => void;

    goIdle: () => void;
    setOffline: (offline: boolean) => void;

    // Message management
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    addUserMessage: (content: string) => void;
    addAssistantMessage: (content: string, reasoning?: ReasoningTrace) => void;
    addSystemMessage: (content: string) => void;
    clearMessages: () => void;

    // Voice state updates (for animations)
    updateVoiceAmplitude: (amplitude: number) => void;
    updateTranscription: (text: string) => void;

    // Settings
    toggleReasoning: () => void;

    // Reset
    reset: () => void;
}

type ArtemisStore = ArtemisStoreState & ArtemisStoreActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: ArtemisStoreState = {
    state: 'IDLE',
    previousState: null,
    messages: [],
    currentTranscription: '',
    currentSuggestion: null,
    voice: {
        isListening: false,
        transcription: '',
        amplitude: 0,
    },
    lastExecutionResult: null,
    isOnline: true,
    showReasoning: false,
};

// ============================================================================
// Helper: Generate unique ID
// ============================================================================

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// Store Creation
// ============================================================================

export const useArtemisStore = create<ArtemisStore>()(
    subscribeWithSelector((set, get) => ({
        ...initialState,

        // ========================================================================
        // State Transitions
        // ========================================================================

        startListening: () => {
            const { state, isOnline } = get();
            if (!isOnline) return;
            if (state !== 'IDLE') return;

            set({
                previousState: state,
                state: 'LISTENING',
                currentTranscription: '',
                voice: {
                    isListening: true,
                    transcription: '',
                    amplitude: 0,
                },
            });
        },

        stopListening: (transcription: string) => {
            const { state } = get();
            if (state !== 'LISTENING') return;

            // Add user message
            get().addUserMessage(transcription);

            set({
                previousState: state,
                state: 'PROCESSING',
                currentTranscription: transcription,
                voice: {
                    isListening: false,
                    transcription: transcription,
                    amplitude: 0,
                },
            });
        },

        cancelListening: () => {
            const { state } = get();
            if (state !== 'LISTENING') return;

            set({
                previousState: state,
                state: 'IDLE',
                currentTranscription: '',
                voice: {
                    isListening: false,
                    transcription: '',
                    amplitude: 0,
                },
            });
        },

        startProcessing: () => {
            const { state, isOnline } = get();
            if (!isOnline) {
                set({ state: 'OFFLINE', previousState: state });
                return;
            }

            set({
                previousState: state,
                state: 'PROCESSING',
            });
        },

        startResponding: (response: string, suggestion?: Suggestion) => {
            const { state } = get();
            if (state !== 'PROCESSING') return;

            // Add assistant message
            get().addAssistantMessage(response);

            set({
                previousState: state,
                state: suggestion ? 'SUGGESTING' : 'RESPONDING',
                currentSuggestion: suggestion || null,
            });
        },

        finishResponding: () => {
            const { state, currentSuggestion } = get();
            if (state !== 'RESPONDING') return;

            // If there's a pending suggestion, show it
            if (currentSuggestion) {
                set({
                    previousState: state,
                    state: 'SUGGESTING',
                });
            } else {
                set({
                    previousState: state,
                    state: 'IDLE',
                });
            }
        },

        showSuggestion: (suggestion: Suggestion) => {
            set({
                previousState: get().state,
                state: 'SUGGESTING',
                currentSuggestion: suggestion,
            });
        },

        approveSuggestion: () => {
            const { state, currentSuggestion } = get();
            if (state !== 'SUGGESTING' || !currentSuggestion) return;

            // Add system message confirming approval
            get().addSystemMessage(`Approved: ${currentSuggestion.title}`);

            set({
                previousState: state,
                state: 'EXECUTING',
            });
        },

        declineSuggestion: () => {
            const { state, currentSuggestion } = get();
            if (state !== 'SUGGESTING') return;

            if (currentSuggestion) {
                get().addSystemMessage(`Declined: ${currentSuggestion.title}`);
            }

            set({
                previousState: state,
                state: 'IDLE',
                currentSuggestion: null,
            });
        },

        startExecuting: () => {
            set({
                previousState: get().state,
                state: 'EXECUTING',
            });
        },

        finishExecuting: (result: ExecutionResult) => {
            const { currentSuggestion } = get();

            // Add feedback message
            if (result.status === 'success') {
                get().addAssistantMessage(result.message);
            } else {
                get().addSystemMessage(`${result.status}: ${result.message}`);
            }

            set({
                previousState: 'EXECUTING',
                state: 'IDLE',
                currentSuggestion: null,
                lastExecutionResult: result,
            });
        },

        goIdle: () => {
            set({
                previousState: get().state,
                state: 'IDLE',
                currentSuggestion: null,
                voice: {
                    isListening: false,
                    transcription: '',
                    amplitude: 0,
                },
            });
        },

        setOffline: (offline: boolean) => {
            const { state } = get();

            if (offline) {
                set({
                    previousState: state,
                    state: 'OFFLINE',
                    isOnline: false,
                });
            } else {
                set({
                    previousState: 'OFFLINE',
                    state: 'IDLE',
                    isOnline: true,
                });
            }
        },

        // ========================================================================
        // Message Management
        // ========================================================================

        addMessage: (message) => {
            const newMessage: Message = {
                ...message,
                id: generateId(),
                timestamp: Date.now(),
            };

            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        },

        addUserMessage: (content: string) => {
            get().addMessage({
                type: 'user',
                content,
            });
        },

        addAssistantMessage: (content: string, reasoning?: ReasoningTrace) => {
            get().addMessage({
                type: 'assistant',
                content,
                metadata: reasoning ? { reasoning } : undefined,
            });
        },

        addSystemMessage: (content: string) => {
            get().addMessage({
                type: 'system',
                content,
            });
        },

        clearMessages: () => {
            set({ messages: [] });
        },

        // ========================================================================
        // Voice State Updates (for animations)
        // ========================================================================

        updateVoiceAmplitude: (amplitude: number) => {
            set((state) => ({
                voice: {
                    ...state.voice,
                    amplitude: Math.max(0, Math.min(1, amplitude)),
                },
            }));
        },

        updateTranscription: (text: string) => {
            set((state) => ({
                voice: {
                    ...state.voice,
                    transcription: text,
                },
                currentTranscription: text,
            }));
        },

        // ========================================================================
        // Settings
        // ========================================================================

        toggleReasoning: () => {
            set((state) => ({
                showReasoning: !state.showReasoning,
            }));
        },

        // ========================================================================
        // Reset
        // ========================================================================

        reset: () => {
            set(initialState);
        },
    }))
);

// ============================================================================
// Selectors (for optimized subscriptions)
// ============================================================================

export const selectArtemisState = (state: ArtemisStore) => state.state;
export const selectIsListening = (state: ArtemisStore) => state.state === 'LISTENING';
export const selectIsProcessing = (state: ArtemisStore) => state.state === 'PROCESSING';
export const selectIsSuggesting = (state: ArtemisStore) => state.state === 'SUGGESTING';
export const selectIsOffline = (state: ArtemisStore) => state.state === 'OFFLINE';
export const selectMessages = (state: ArtemisStore) => state.messages;
export const selectCurrentSuggestion = (state: ArtemisStore) => state.currentSuggestion;
export const selectVoiceAmplitude = (state: ArtemisStore) => state.voice.amplitude;

// ============================================================================
// State to Orb Animation Mapping
// ============================================================================

export const stateToOrbBehavior: Record<ArtemisState, {
    animation: 'breathing' | 'waveform' | 'swirl' | 'pulse' | 'glow' | 'burst' | 'dim';
    intensity: number;
    speed: number;
}> = {
    IDLE: { animation: 'breathing', intensity: 0.5, speed: 1 },
    LISTENING: { animation: 'waveform', intensity: 1, speed: 1 },
    PROCESSING: { animation: 'swirl', intensity: 0.8, speed: 1.5 },
    RESPONDING: { animation: 'pulse', intensity: 0.7, speed: 1 },
    SUGGESTING: { animation: 'glow', intensity: 0.9, speed: 0.8 },
    EXECUTING: { animation: 'burst', intensity: 1, speed: 2 },
    OFFLINE: { animation: 'dim', intensity: 0.3, speed: 0.5 },
};
