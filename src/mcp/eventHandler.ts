/**
 * MCP Event Handler
 * Maps MCP events to UI updates (orb state, chat messages, reasoning)
 * This is the bridge between intelligence and experience
 */

import { useArtemisStore } from '@/src/state/artemisStore';
import { useConversationStore } from '@/src/state/conversationStore';
import { useReasoningStore } from '@/src/state/reasoningStore';
import {
    ErrorEvent,
    ExecutionResultEvent,
    ExecutionStartEvent,
    MCPEvent,
    MessageEvent,
    SuggestionEvent,
    ThoughtEvent,
} from './types';

// ============================================================================
// Event Handlers
// ============================================================================

/**
 * Handle THOUGHT event - internal reasoning
 * Only visible if reasoning panel is enabled
 */
function handleThought(event: ThoughtEvent): void {
    const { addThought } = useReasoningStore.getState();
    addThought({
        content: event.payload.reasoning,
        confidence: event.payload.confidence,
        step: event.payload.step,
        timestamp: event.timestamp,
    });
}

/**
 * Handle MESSAGE event - assistant response
 * Adds chat bubble, changes orb to RESPONDING
 */
function handleMessage(event: MessageEvent): void {
    const { startResponding } = useArtemisStore.getState();
    const { addAssistantMessage } = useConversationStore.getState();

    // Add to chat
    addAssistantMessage(event.payload.content);

    // Update orb state
    startResponding(event.payload.content);

    // TODO: Trigger TTS if enabled
    // if (event.payload.tts !== false) { triggerTTS(event.payload.content); }
}

/**
 * Handle SUGGESTION event - action proposal
 * Shows suggestion card, changes orb to SUGGESTING
 */
function handleSuggestion(event: SuggestionEvent): void {
    const { addSuggestion } = useConversationStore.getState();

    // Add suggestion to chat
    addSuggestion(event.payload.content, {
        actionType: event.payload.actionType,
        targetId: event.payload.targetId,
        parameters: event.payload.parameters,
    });

    // Orb state will be set to SUGGESTING by the store
}

/**
 * Handle EXECUTION_START event - action beginning
 * Shows system message, changes orb to EXECUTING
 */
function handleExecutionStart(event: ExecutionStartEvent): void {
    const { startExecuting } = useArtemisStore.getState();
    const { addSystemMessage } = useConversationStore.getState();

    // Add system message
    addSystemMessage(event.payload.description);

    // Update orb state
    startExecuting();
}

/**
 * Handle EXECUTION_RESULT event - action completed
 * Shows confirmation, returns orb to IDLE
 */
function handleExecutionResult(event: ExecutionResultEvent): void {
    const { goIdle } = useArtemisStore.getState();
    const { addSystemMessage } = useConversationStore.getState();

    // Add result message
    const prefix = event.payload.success ? '✓' : '✗';
    const message = event.payload.message ||
        (event.payload.success ? 'Action completed' : 'Action failed');
    addSystemMessage(`${prefix} ${message}`);

    // Return to idle
    goIdle();
}

/**
 * Handle ERROR event - something went wrong
 * Shows calm message, returns orb to IDLE
 */
function handleError(event: ErrorEvent): void {
    const { goIdle } = useArtemisStore.getState();
    const { addSystemMessage } = useConversationStore.getState();

    // Calm error message (not scary)
    let message = event.payload.message;
    if (event.payload.suggestion) {
        message += ` ${event.payload.suggestion}`;
    }
    addSystemMessage(message);

    // Return to idle
    goIdle();
}

// ============================================================================
// Main Event Dispatcher
// ============================================================================

/**
 * Process an MCP event and dispatch to appropriate handler
 * This is the main entry point for MCP → UI updates
 */
export function processMCPEvent(event: MCPEvent): void {
    console.log(`[MCP] Processing event: ${event.type}`, event.payload);

    switch (event.type) {
        case 'THOUGHT':
            handleThought(event);
            break;
        case 'MESSAGE':
            handleMessage(event);
            break;
        case 'SUGGESTION':
            handleSuggestion(event);
            break;
        case 'EXECUTION_START':
            handleExecutionStart(event);
            break;
        case 'EXECUTION_RESULT':
            handleExecutionResult(event);
            break;
        case 'ERROR':
            handleError(event);
            break;
        default:
            console.warn('[MCP] Unknown event type:', event);
    }
}

// ============================================================================
// Mock Event Generators (for testing)
// ============================================================================

import { generateEventId } from './types';

export const mockEvents = {
    thought: (reasoning: string, confidence = 0.8): ThoughtEvent => ({
        id: generateEventId(),
        type: 'THOUGHT',
        timestamp: Date.now(),
        payload: { reasoning, confidence },
    }),

    message: (content: string, tts = true): MessageEvent => ({
        id: generateEventId(),
        type: 'MESSAGE',
        timestamp: Date.now(),
        payload: { content, tts },
    }),

    suggestion: (
        content: string,
        actionType: 'device' | 'automation' | 'function' = 'device',
        targetId: string = 'unknown'
    ): SuggestionEvent => ({
        id: generateEventId(),
        type: 'SUGGESTION',
        timestamp: Date.now(),
        payload: {
            content,
            actionType,
            targetId,
            riskLevel: 'low',
            requiresApproval: true,
        },
    }),

    executionStart: (description: string): ExecutionStartEvent => ({
        id: generateEventId(),
        type: 'EXECUTION_START',
        timestamp: Date.now(),
        payload: {
            actionId: generateEventId(),
            description,
            targetId: 'unknown',
        },
    }),

    executionResult: (success: boolean, message?: string): ExecutionResultEvent => ({
        id: generateEventId(),
        type: 'EXECUTION_RESULT',
        timestamp: Date.now(),
        payload: {
            actionId: 'last',
            success,
            message,
        },
    }),

    error: (message: string, suggestion?: string): ErrorEvent => ({
        id: generateEventId(),
        type: 'ERROR',
        timestamp: Date.now(),
        payload: {
            code: 'ERR_UNKNOWN',
            message,
            recoverable: true,
            suggestion,
        },
    }),
};
