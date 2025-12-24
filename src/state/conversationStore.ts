/**
 * Conversation Store
 * Manages the chat messages for Artemis conversation
 */

import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================

export type MessageType = 'USER' | 'ASSISTANT' | 'SUGGESTION' | 'SYSTEM';

export interface SuggestionData {
    actionType: 'device' | 'automation' | 'function';
    targetId: string;
    parameters?: Record<string, unknown>;
}

export interface ConversationMessage {
    id: string;
    type: MessageType;
    content: string;
    timestamp: number;
    suggestion?: SuggestionData;
    pending?: boolean;
    approved?: boolean;
}

// ============================================================================
// Store Interface
// ============================================================================

interface ConversationStoreState {
    messages: ConversationMessage[];
}

interface ConversationStoreActions {
    addMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => string;
    addUserMessage: (content: string) => string;
    addAssistantMessage: (content: string) => string;
    addSuggestion: (content: string, suggestion: SuggestionData) => string;
    addSystemMessage: (content: string) => string;
    updateMessage: (id: string, updates: Partial<ConversationMessage>) => void;
    approveSuggestion: (id: string) => void;
    rejectSuggestion: (id: string) => void;
    removeMessage: (id: string) => void;
    clearConversation: () => void;
}

type ConversationStore = ConversationStoreState & ConversationStoreActions;

// ============================================================================
// Helper
// ============================================================================

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// Initial State
// ============================================================================

const initialState: ConversationStoreState = {
    messages: [],
};

// ============================================================================
// Store Creation
// ============================================================================

export const useConversationStore = create<ConversationStore>((set, get) => ({
    ...initialState,

    addMessage: (message) => {
        const id = generateId();
        const newMessage: ConversationMessage = {
            ...message,
            id,
            timestamp: Date.now(),
        };
        set((state) => ({
            messages: [...state.messages, newMessage],
        }));
        return id;
    },

    addUserMessage: (content) => {
        return get().addMessage({ type: 'USER', content });
    },

    addAssistantMessage: (content) => {
        return get().addMessage({ type: 'ASSISTANT', content });
    },

    addSuggestion: (content, suggestion) => {
        return get().addMessage({
            type: 'SUGGESTION',
            content,
            suggestion,
            pending: true,
        });
    },

    addSystemMessage: (content) => {
        return get().addMessage({ type: 'SYSTEM', content });
    },

    updateMessage: (id, updates) => {
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === id ? { ...msg, ...updates } : msg
            ),
        }));
    },

    approveSuggestion: (id) => {
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === id ? { ...msg, approved: true, pending: false } : msg
            ),
        }));
    },

    rejectSuggestion: (id) => {
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === id ? { ...msg, approved: false, pending: false } : msg
            ),
        }));
    },

    removeMessage: (id) => {
        set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== id),
        }));
    },

    clearConversation: () => {
        set({ messages: [] });
    },
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectMessages = (state: ConversationStore) => state.messages;
export const selectPendingSuggestion = (state: ConversationStore) =>
    state.messages.find((m) => m.type === 'SUGGESTION' && m.pending);
