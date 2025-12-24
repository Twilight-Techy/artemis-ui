/**
 * Reasoning Store
 * Stores MCP reasoning thoughts for the insight panel
 */

import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================

export interface Thought {
    id: string;
    content: string;
    confidence?: number;
    step?: number;
    timestamp: number;
}

// ============================================================================
// Store Interface
// ============================================================================

interface ReasoningStoreState {
    thoughts: Thought[];
    isVisible: boolean;
    maxThoughts: number;
}

interface ReasoningStoreActions {
    addThought: (thought: Omit<Thought, 'id'>) => void;
    clearThoughts: () => void;
    setVisible: (visible: boolean) => void;
    toggleVisible: () => void;
}

type ReasoningStore = ReasoningStoreState & ReasoningStoreActions;

// ============================================================================
// Helper
// ============================================================================

const generateId = () => `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// Initial State
// ============================================================================

const initialState: ReasoningStoreState = {
    thoughts: [],
    isVisible: false,
    maxThoughts: 20, // Keep last 20 thoughts
};

// ============================================================================
// Store Creation
// ============================================================================

export const useReasoningStore = create<ReasoningStore>((set, get) => ({
    ...initialState,

    addThought: (thought) => {
        const newThought: Thought = {
            ...thought,
            id: generateId(),
        };

        set((state) => {
            const updatedThoughts = [...state.thoughts, newThought];
            // Keep only the last N thoughts
            if (updatedThoughts.length > state.maxThoughts) {
                return { thoughts: updatedThoughts.slice(-state.maxThoughts) };
            }
            return { thoughts: updatedThoughts };
        });
    },

    clearThoughts: () => {
        set({ thoughts: [] });
    },

    setVisible: (visible) => {
        set({ isVisible: visible });
    },

    toggleVisible: () => {
        set((state) => ({ isVisible: !state.isVisible }));
    },
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectThoughts = (state: ReasoningStore) => state.thoughts;
export const selectIsReasoningVisible = (state: ReasoningStore) => state.isVisible;
export const selectLatestThought = (state: ReasoningStore) =>
    state.thoughts[state.thoughts.length - 1];
