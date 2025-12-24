/**
 * Automation Sentence Generator
 * Converts automation rules to human-readable sentences
 * 
 * Goal: Make every automation feel like a promise Artemis is making
 */

import {
    Action,
    AutomationRule,
    DeviceAction,
    DeviceTrigger,
    EventTrigger,
    NotifyAction,
    SceneAction,
    SensorTrigger,
    SetAction,
    TimeTrigger,
    Trigger,
} from './types';

// ============================================================================
// Trigger → Sentence
// ============================================================================

function formatSensorTrigger(trigger: SensorTrigger): string {
    const sensorNames: Record<string, string> = {
        temperature: 'temperature',
        humidity: 'humidity',
        light_level: 'light level',
        motion: 'motion',
        door: 'door',
        window: 'window',
    };

    const operatorWords: Record<string, string> = {
        '>': 'goes above',
        '<': 'drops below',
        '=': 'reaches',
        '>=': 'reaches or exceeds',
        '<=': 'reaches or drops below',
    };

    const sensor = sensorNames[trigger.sensorType] || trigger.sensorType;
    const op = operatorWords[trigger.operator] || trigger.operator;
    const unit = trigger.unit || (trigger.sensorType === 'temperature' ? '°C' : '');

    return `the ${sensor} ${op} ${trigger.value}${unit}`;
}

function formatTimeTrigger(trigger: TimeTrigger): string {
    // Convert 24h to 12h format
    const [hours, minutes] = trigger.time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const timeStr = `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;

    if (trigger.days && trigger.days.length > 0 && trigger.days.length < 7) {
        const dayNames: Record<string, string> = {
            mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
            thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
        };
        const days = trigger.days.map(d => dayNames[d]).join(', ');
        return `it's ${timeStr} on ${days}`;
    }

    return `it's ${timeStr}${trigger.repeat ? ' every day' : ''}`;
}

function formatEventTrigger(trigger: EventTrigger): string {
    const eventNames: Record<string, string> = {
        motion_detected: 'motion is detected',
        door_opened: 'the door opens',
        door_closed: 'the door closes',
        window_opened: 'the window opens',
        window_closed: 'the window closes',
        presence_home: 'you arrive home',
        presence_away: 'you leave home',
    };

    return eventNames[trigger.eventName] || trigger.eventName.replace(/_/g, ' ');
}

function formatDeviceTrigger(trigger: DeviceTrigger): string {
    const opWords: Record<string, string> = {
        '=': 'is',
        '!=': 'is not',
        '>': 'is above',
        '<': 'is below',
    };

    return `${trigger.deviceId} ${trigger.property} ${opWords[trigger.operator]} ${trigger.value}`;
}

function formatTrigger(trigger: Trigger): string {
    switch (trigger.type) {
        case 'sensor':
            return formatSensorTrigger(trigger);
        case 'time':
            return formatTimeTrigger(trigger);
        case 'event':
            return formatEventTrigger(trigger);
        case 'device':
            return formatDeviceTrigger(trigger);
        default:
            return 'something happens';
    }
}

// ============================================================================
// Action → Sentence
// ============================================================================

function formatDeviceAction(action: DeviceAction): string {
    const device = action.deviceName || action.deviceId;
    switch (action.type) {
        case 'turn_on':
            return `turn on the ${device}`;
        case 'turn_off':
            return `turn off the ${device}`;
        case 'toggle':
            return `toggle the ${device}`;
    }
}

function formatSetAction(action: SetAction): string {
    const device = action.deviceName || action.deviceId;
    const unit = action.unit || '';
    return `set the ${device} ${action.property} to ${action.value}${unit}`;
}

function formatNotifyAction(action: NotifyAction): string {
    return `send you a notification: "${action.message}"`;
}

function formatSceneAction(action: SceneAction): string {
    return `activate the "${action.sceneName || action.sceneId}" scene`;
}

function formatAction(action: Action): string {
    switch (action.type) {
        case 'turn_on':
        case 'turn_off':
        case 'toggle':
            return formatDeviceAction(action);
        case 'set':
            return formatSetAction(action);
        case 'notify':
            return formatNotifyAction(action);
        case 'scene':
            return formatSceneAction(action);
        case 'delay':
            return `wait ${action.duration} seconds`;
        default:
            return 'perform an action';
    }
}

// ============================================================================
// Full Rule → Sentence
// ============================================================================

/**
 * Generate a friendly, conversational sentence from an automation rule
 * This is what Artemis says when explaining an automation
 */
export function generateRuleSentence(rule: AutomationRule): string {
    const trigger = formatTrigger(rule.trigger);
    const actions = rule.actions.map(formatAction);
    const location = rule.location ? ` in the ${rule.location}` : '';

    // Join multiple actions
    let actionText: string;
    if (actions.length === 1) {
        actionText = actions[0];
    } else if (actions.length === 2) {
        actionText = `${actions[0]} and ${actions[1]}`;
    } else {
        const last = actions.pop();
        actionText = `${actions.join(', ')}, and ${last}`;
    }

    return `I'll ${actionText}${location} whenever ${trigger}.`;
}

/**
 * Generate a short summary for list views
 */
export function generateRuleSummary(rule: AutomationRule): string {
    const trigger = formatTrigger(rule.trigger);
    const action = rule.actions.length > 0 ? formatAction(rule.actions[0]) : 'do something';
    const more = rule.actions.length > 1 ? ` (+${rule.actions.length - 1} more)` : '';

    return `When ${trigger} → ${action}${more}`;
}

/**
 * Generate the visual WHEN/DO text for rule cards
 */
export function generateRuleBlocks(rule: AutomationRule): { when: string; doText: string[] } {
    const when = formatTrigger(rule.trigger);
    const doText = rule.actions.map(formatAction);

    return { when, doText };
}

/**
 * Generate confirmation text after creating an automation
 */
export function generateConfirmationMessage(rule: AutomationRule): string {
    const sentence = generateRuleSentence(rule);
    return `${sentence}\n\nYou can change or disable this anytime.`;
}
