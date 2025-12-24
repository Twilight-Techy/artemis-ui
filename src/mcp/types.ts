/**
 * MCP Event Types
 * Defines the contract between MCP (intelligence) and UI (experience)
 * MCP events drive Artemis orb state and UI updates
 */

// ============================================================================
// Event Types
// ============================================================================

export type MCPEventType =
    | 'THOUGHT'           // Internal reasoning step
    | 'MESSAGE'           // Assistant response for chat
    | 'SUGGESTION'        // Action proposal requiring confirmation
    | 'EXECUTION_START'   // Action has begun
    | 'EXECUTION_RESULT'  // Action completed
    | 'ERROR';            // Something went wrong

// Risk levels for suggestions
export type RiskLevel = 'low' | 'medium' | 'high';

// ============================================================================
// Event Payloads
// ============================================================================

export interface ThoughtPayload {
    reasoning: string;
    confidence?: number; // 0-1
    step?: number;       // For multi-step reasoning
}

export interface MessagePayload {
    content: string;
    tts?: boolean; // Whether to play TTS (default: true)
}

export interface SuggestionPayload {
    content: string;
    actionType: 'device' | 'automation' | 'function';
    targetId: string;
    parameters?: Record<string, unknown>;
    riskLevel: RiskLevel;
    requiresApproval: boolean;
}

export interface ExecutionStartPayload {
    actionId: string;
    description: string;
    targetId: string;
}

export interface ExecutionResultPayload {
    actionId: string;
    success: boolean;
    message?: string;
    affectedDevices?: string[];
}

export interface ErrorPayload {
    code: string;
    message: string;
    recoverable: boolean;
    suggestion?: string; // What user can do
}

// Union type for all payloads
export type MCPEventPayload =
    | ThoughtPayload
    | MessagePayload
    | SuggestionPayload
    | ExecutionStartPayload
    | ExecutionResultPayload
    | ErrorPayload;

// ============================================================================
// MCP Event Interface
// ============================================================================

interface BaseEvent<T extends MCPEventType, P extends MCPEventPayload> {
    id: string;
    type: T;
    timestamp: number;
    payload: P;
}

export type ThoughtEvent = BaseEvent<'THOUGHT', ThoughtPayload>;
export type MessageEvent = BaseEvent<'MESSAGE', MessagePayload>;
export type SuggestionEvent = BaseEvent<'SUGGESTION', SuggestionPayload>;
export type ExecutionStartEvent = BaseEvent<'EXECUTION_START', ExecutionStartPayload>;
export type ExecutionResultEvent = BaseEvent<'EXECUTION_RESULT', ExecutionResultPayload>;
export type ErrorEvent = BaseEvent<'ERROR', ErrorPayload>;

export type MCPEvent =
    | ThoughtEvent
    | MessageEvent
    | SuggestionEvent
    | ExecutionStartEvent
    | ExecutionResultEvent
    | ErrorEvent;

// ============================================================================
// Event → Orb State Mapping
// ============================================================================

/**
 * Maps MCP event types to Artemis orb states
 * This is the source of truth for state transitions
 */
export const EVENT_TO_ORB_STATE: Record<MCPEventType, string | null> = {
    THOUGHT: null,              // Stay in current state (PROCESSING)
    MESSAGE: 'RESPONDING',      // Speaking response
    SUGGESTION: 'SUGGESTING',   // Waiting for user decision
    EXECUTION_START: 'EXECUTING', // Acting on approved action
    EXECUTION_RESULT: 'IDLE',   // Return to idle
    ERROR: 'IDLE',              // Return to idle (with error feedback)
};

// ============================================================================
// Helper: Generate Event ID
// ============================================================================

export const generateEventId = (): string =>
    `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
