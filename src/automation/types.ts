/**
 * Artemis Automation Language (AAL) Types
 * Defines the structure for user-defined automations
 * 
 * Structure: WHEN <trigger> [IF <condition>] DO <action> [IN <location>]
 */

// ============================================================================
// Trigger Types
// ============================================================================

export type TriggerType = 'sensor' | 'time' | 'event' | 'device';

// Sensor trigger: temperature > 28
export interface SensorTrigger {
    type: 'sensor';
    sensorType: 'temperature' | 'humidity' | 'light_level' | 'motion' | 'door' | 'window';
    operator: '>' | '<' | '=' | '>=' | '<=';
    value: number;
    unit?: string;
}

// Time trigger: AT 7:00 PM
export interface TimeTrigger {
    type: 'time';
    time: string; // HH:MM format
    days?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
    repeat: boolean;
}

// Event trigger: motion_detected, door_opened
export interface EventTrigger {
    type: 'event';
    eventName: string;
    deviceId?: string;
}

// Device state trigger: light is on
export interface DeviceTrigger {
    type: 'device';
    deviceId: string;
    property: string;
    operator: '=' | '!=' | '>' | '<';
    value: string | number | boolean;
}

export type Trigger = SensorTrigger | TimeTrigger | EventTrigger | DeviceTrigger;

// ============================================================================
// Condition Types (Optional filters)
// ============================================================================

export interface Condition {
    type: 'and' | 'or';
    left: ConditionExpression;
    right: ConditionExpression;
}

export interface ConditionExpression {
    sensorType?: string;
    deviceId?: string;
    property?: string;
    operator: '>' | '<' | '=' | '>=' | '<=' | '!=';
    value: string | number | boolean;
}

// ============================================================================
// Action Types
// ============================================================================

export type ActionType = 'turn_on' | 'turn_off' | 'set' | 'toggle' | 'notify' | 'delay' | 'scene';

export interface DeviceAction {
    type: 'turn_on' | 'turn_off' | 'toggle';
    deviceId: string;
    deviceName?: string; // For display
}

export interface SetAction {
    type: 'set';
    deviceId: string;
    deviceName?: string;
    property: string;
    value: string | number | boolean;
    unit?: string;
}

export interface NotifyAction {
    type: 'notify';
    message: string;
    priority?: 'low' | 'normal' | 'high';
}

export interface DelayAction {
    type: 'delay';
    duration: number; // in seconds
}

export interface SceneAction {
    type: 'scene';
    sceneId: string;
    sceneName?: string;
}

export type Action = DeviceAction | SetAction | NotifyAction | DelayAction | SceneAction;

// ============================================================================
// Automation Rule
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high';
export type TrustLevel = 'ask_always' | 'ask_once' | 'auto_approve';

export interface AutomationRule {
    id: string;
    name: string;
    description?: string;

    // The rule structure
    trigger: Trigger;
    conditions?: Condition[];
    actions: Action[];
    location?: string; // Room or area

    // Metadata
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
    lastTriggered?: number;
    triggerCount: number;

    // Trust & Safety
    riskLevel: RiskLevel;
    trustLevel: TrustLevel;
    requiresConfirmation: boolean;

    // Source
    createdBy: 'voice' | 'manual' | 'suggested';

    // For Python automations (advanced)
    isPython?: boolean;
    pythonCode?: string;
}

// ============================================================================
// Rule Creation Draft (for UI)
// ============================================================================

export interface AutomationDraft {
    trigger?: Partial<Trigger>;
    conditions?: Partial<Condition>[];
    actions?: Partial<Action>[];
    location?: string;
    name?: string;
}

// ============================================================================
// Helper: Generate Rule ID
// ============================================================================

export const generateRuleId = (): string =>
    `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
